pub mod data;
pub mod event;
mod window;

use accessibility_sys::{AXError, AXUIElementRef};
use active_win_pos_rs::{get_active_window, ActiveWindow};
use cocoa::{
    appkit::{CGPoint, NSEventMask, NSEventType, NSScreen, NSView, NSWindow},
    base::{id, nil},
    foundation::{NSArray, NSPoint, NSRect, NSSize},
};
use core_graphics::geometry::{CGRect, CGSize};
use data::{MouseEvent, Point, WindowInfo};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use window::WindowElement;

use crate::window_manager::{data::Frame, event::Event};

use self::data::{Screen, SetWindowPosition, Size};

pub struct WindowManager {
    app: AppHandle,
}

impl WindowManager {
    pub(crate) fn new(app: AppHandle) -> Self {
        WindowManager { app: app }
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
        unsafe {
            window.setFrame_display_(
                NSRect {
                    origin: origin,
                    size: size,
                },
                true,
            )
        }
    }

    pub fn get_screens() -> Vec<Screen> {
        unsafe {
            let screens = NSScreen::screens(nil);
            let mut frames: Vec<Screen> = vec![];
            for i in 0..unsafe { screens.count() } {
                let frame = NSScreen::frame(screens.objectAtIndex(i));
                let visibleFrame = NSScreen::visibleFrame(screens.objectAtIndex(i));
                frames.push(Screen {
                    visibleFrame: Frame {
                        size: Size {
                            width: visibleFrame.size.width,
                            height: visibleFrame.size.height,
                        },
                        position: Point {
                            x: visibleFrame.origin.x,
                            y: visibleFrame.origin.y,
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
                });
            }
            frames
        }
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

    pub fn start(&self) {
        let mut last_win: Mutex<Option<ActiveWindow>> = Mutex::new(None.into());
        let mut app = Mutex::new(self.app.clone());

        Event::global_monitor(
            NSEventMask::NSLeftMouseDownMask
                | NSEventMask::NSLeftMouseUpMask
                | NSEventMask::NSLeftMouseDraggedMask,
            move |event| {
                let location = Event::location(event);
                let location = Point {
                    x: location.x,
                    y: location.y,
                };
                let event_type = Event::eventType(event);

                match event_type {
                    NSEventType::NSLeftMouseDown => {
                        let mut inner = last_win.lock().unwrap();
                        let active_window = get_active_window();
                        match active_window {
                            Ok(active_window) => {
                                *inner = Some(get_active_window().unwrap());
                                let json = serde_json::to_string(&MouseEvent {
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
                                })
                                .unwrap();
                                app.lock()
                                    .unwrap()
                                    .emit_all("window_manager", format!("{}", json));
                            }
                            Err(_) => {}
                        }
                    }
                    NSEventType::NSLeftMouseUp => {
                        let mut inner = last_win.lock().unwrap();
                        if (!inner.is_none()) {
                            let active_window = inner.as_mut().unwrap();
                            let json = serde_json::to_string(&MouseEvent {
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
                            })
                            .unwrap();
                            app.lock()
                                .unwrap()
                                .emit_all("window_manager", format!("{}", json));
                        }
                        *inner = None;
                    }
                    NSEventType::NSLeftMouseDragged => {
                        let current_win = get_active_window();
                        match current_win {
                            Ok(current_win) => {
                                let mut last_win_box = last_win.lock().unwrap();
                                let is_moving = !last_win_box.is_none()
                                    && last_win_box.as_mut().unwrap().position.height
                                        == current_win.position.height
                                    && last_win_box.as_mut().unwrap().position.width
                                        == current_win.position.width
                                    && (last_win_box.as_mut().unwrap().position.x
                                        != current_win.position.x
                                        || last_win_box.as_mut().unwrap().position.y
                                            != current_win.position.y);

                                if is_moving {
                                    let json = serde_json::to_string(&MouseEvent {
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
                                    })
                                    .unwrap();
                                    app.lock()
                                        .unwrap()
                                        .emit_all("window_manager", format!("{}", json));
                                }
                            }
                            Err(_) => {}
                        }
                    }
                    _ => {}
                };

                None
            },
        )
    }
}
