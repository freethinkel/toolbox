pub mod data;
pub mod event;
mod window;

use active_win_pos_rs::{get_active_window, ActiveWindow};
use cocoa::{
    appkit::{CGPoint, NSEventMask, NSEventType, NSScreen, NSWindow},
    base::{id, nil, YES},
    foundation::{NSArray, NSPoint, NSRect, NSSize},
};
use core_graphics::geometry::{CGRect, CGSize};
use data::{MouseEvent, Point, WindowInfo};
use macos_accessibility_client::accessibility::application_is_trusted_with_prompt;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use window::WindowElement;

use crate::window_manager::{data::Frame, event::EventMonitor};

use self::data::{CocoaScreen, Screen, SetWindowPosition, Size};

#[derive(Clone)]
pub struct WindowManager {
    app: AppHandle,
    monitor: Option<EventMonitor>,
}

fn nsrect_to_cgrect(rect: NSRect) -> CGRect {
    unsafe {
        let main_screen = NSScreen::mainScreen(nil);
        let main_screen_frame = NSScreen::frame(main_screen);

        let rect = CGRect {
            origin: CGPoint {
                x: rect.origin.x,
                y: main_screen_frame.origin.y - rect.origin.y - rect.size.height
                    + main_screen_frame.size.height,
            },
            size: CGSize {
                width: rect.size.width,
                height: rect.size.height,
            },
        };

        CGRect::new(&rect.origin, &rect.size)
    }
}

impl WindowManager {
    pub(crate) fn new(app: AppHandle) -> Self {
        WindowManager { app, monitor: None }
    }

    pub fn check_permission() {
        application_is_trusted_with_prompt();
    }

    pub fn get_screens() -> Vec<Screen> {
        unsafe {
            let screens = NSScreen::screens(nil);
            let mut frames: Vec<Screen> = vec![];
            (0..screens.count()).for_each(|i| {
                let frame = NSScreen::frame(screens.objectAtIndex(i));
                let visible_frame = NSScreen::visibleFrame(screens.objectAtIndex(i));
                let cgframe = nsrect_to_cgrect(NSScreen::frame(screens.objectAtIndex(i)));
                let cgvisible_frame =
                    nsrect_to_cgrect(NSScreen::visibleFrame(screens.objectAtIndex(i)));
                frames.push(Screen {
                    cocoa: CocoaScreen {
                        visible_frame: Frame {
                            size: Size {
                                height: visible_frame.size.height,
                                width: visible_frame.size.width,
                            },
                            position: Point {
                                x: visible_frame.origin.x,
                                y: visible_frame.origin.y,
                            },
                        },
                        frame: Frame {
                            size: Size {
                                width: frame.size.width,
                                height: frame.size.height,
                            },
                            position: Point {
                                x: frame.origin.x,
                                y: frame.origin.y,
                            },
                        },
                    },
                    visible_frame: Frame {
                        size: Size {
                            width: cgvisible_frame.size.width,
                            height: cgvisible_frame.size.height,
                        },
                        position: Point {
                            x: cgvisible_frame.origin.x,
                            y: cgvisible_frame.origin.y,
                        },
                    },
                    frame: Frame {
                        size: Size {
                            width: cgframe.size.width,
                            height: cgframe.size.height,
                        },
                        position: Point {
                            x: cgframe.origin.x,
                            y: cgframe.origin.y,
                        },
                    },
                });
            });
            frames
        }
    }

    pub fn set_current_window_position(window: id, rect: Frame) {
        let size = NSSize {
            width: rect.size.width,
            height: rect.size.height,
        };
        let origin = NSPoint {
            x: rect.position.x,
            y: rect.position.y,
        };

        unsafe { window.setFrame_display_(NSRect { origin, size }, YES) }
    }

    pub fn set_window_position(win_data: SetWindowPosition) {
        let win = WindowElement::get_window_from_id(win_data.pid, win_data.id);

        WindowElement::set_frame(
            win.unwrap(),
            CGRect {
                origin: CGPoint {
                    x: win_data.position.x,
                    y: win_data.position.y,
                },
                size: CGSize {
                    width: win_data.size.width,
                    height: win_data.size.height,
                },
            },
        );
    }

    pub fn stop(&self) {
        match &self.monitor {
            Some(monitor) => {
                monitor.stop();
            }
            None => {}
        }
    }

    pub fn start(&self) -> WindowManager {
        let last_win: Mutex<Option<ActiveWindow>> = Mutex::new(None.into());
        let app = Mutex::new(self.app.clone());

        WindowManager::check_permission();

        match &self.monitor {
            Some(monitor) => {
                monitor.stop();
            }
            None => {}
        }

        let monitor = EventMonitor::global_monitor(
            NSEventMask::NSLeftMouseDownMask
                | NSEventMask::NSLeftMouseUpMask
                | NSEventMask::NSLeftMouseDraggedMask,
            move |event| {
                let location = EventMonitor::location(event);
                let location = Point {
                    x: location.x,
                    y: location.y,
                };
                let event_type = EventMonitor::event_type(event);

                match event_type {
                    NSEventType::NSLeftMouseDown => {
                        let mut inner = last_win.lock().unwrap();
                        let active_window = get_active_window();
                        match active_window {
                            Ok(active_window) => {
                                *inner = Some(get_active_window().unwrap());
                                let payload = &MouseEvent {
                                    point: location,
                                    event_type: "mouse_down".to_string(),
                                    window_info: Some(WindowInfo {
                                        id: active_window.window_id,
                                        pid: active_window.process_id,
                                        point: {
                                            Point {
                                                x: active_window.position.x,
                                                y: active_window.position.y,
                                            }
                                        },
                                    }),
                                };
                                match app.lock() {
                                    Ok(app) => {
                                        if let Ok(_) = app.emit_all("window_manager", payload) {}
                                    }
                                    Err(_) => {}
                                }
                            }
                            Err(_) => {}
                        }
                    }
                    NSEventType::NSLeftMouseUp => {
                        let mut inner = last_win.lock().unwrap();
                        if !inner.is_none() {
                            let active_window = inner.as_mut().unwrap();
                            let payload = &MouseEvent {
                                event_type: "mouse_up".to_string(),
                                point: location,
                                window_info: Some(WindowInfo {
                                    id: active_window.window_id.to_string(),
                                    pid: active_window.process_id,
                                    point: {
                                        Point {
                                            x: active_window.position.x,
                                            y: active_window.position.y,
                                        }
                                    },
                                }),
                            };
                            match app.lock() {
                                Ok(app) => {
                                    if let Ok(_) = app.emit_all("window_manager", payload) {}
                                }
                                Err(_) => {}
                            }
                        }
                        *inner = None;
                    }
                    NSEventType::NSLeftMouseDragged => {
                        let current_win = get_active_window();
                        match current_win {
                            Ok(current_win) => match last_win.lock() {
                                Ok(last_win) => match last_win.as_ref() {
                                    Some(last_win) => {
                                        let is_moving = last_win.position.height
                                            == current_win.position.height
                                            && last_win.position.width
                                                == current_win.position.width
                                            && (last_win.position.x != current_win.position.x
                                                || last_win.position.y != current_win.position.y);

                                        if is_moving {
                                            let payload = &MouseEvent {
                                                event_type: "dragging".to_string(),
                                                point: location,
                                                window_info: Some(WindowInfo {
                                                    id: current_win.window_id,
                                                    pid: current_win.process_id,
                                                    point: {
                                                        Point {
                                                            x: current_win.position.x,
                                                            y: current_win.position.y,
                                                        }
                                                    },
                                                }),
                                            };
                                            match app.lock() {
                                                Ok(app) => {
                                                    if let Ok(_) =
                                                        app.emit_all("window_manager", payload)
                                                    {
                                                    }
                                                }
                                                Err(_) => {}
                                            }
                                        }
                                    }
                                    None => {}
                                },
                                Err(_) => {}
                            },
                            Err(_) => {}
                        }
                    }
                    _ => {}
                };

                None
            },
        );

        WindowManager {
            app: self.app.clone(),
            monitor: Some(monitor),
        }
    }
}
