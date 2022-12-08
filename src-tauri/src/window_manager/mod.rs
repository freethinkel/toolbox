use std::{fmt::format, sync::Mutex};

use active_win_pos_rs::{get_active_window, ActiveWindow};
use cocoa::appkit::{CGPoint, NSEventMask, NSEventType};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

use crate::window_manager::event::Event;

pub mod event;

pub struct WindowManager {
    app: AppHandle,
}

#[derive(Serialize, Deserialize)]
struct Point {
    x: f64,
    y: f64,
}

#[derive(Serialize, Deserialize)]
struct MouseEvent {
    point: Point,
    event_type: String,
}

impl WindowManager {
    // let handler: Fn(String) -> String

    pub(crate) fn new(app: AppHandle) -> Self {
        WindowManager { app: app }
    }

    fn point_to_json(point: CGPoint) -> Point {
        let x = 1.0;
        Point {
            x: point.x,
            y: point.y,
        }
    }

    pub fn start(&self) {
        let mut last_win: Mutex<Option<ActiveWindow>> = Mutex::new(None.into());
        let mut app = Mutex::new(self.app.clone());
        // let mut handler = |event| (self.handler)(event);

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
                        *inner = Some(get_active_window().unwrap());
                        let json = serde_json::to_string(&MouseEvent {
                            event_type: "mouse_down".to_string(),
                            point: location,
                        })
                        .unwrap();
                        app.lock()
                            .unwrap()
                            .emit_all("window_manager", format!("{}", json));
                    }
                    NSEventType::NSLeftMouseUp => {
                        let mut inner = last_win.lock().unwrap();
                        let json = serde_json::to_string(&MouseEvent {
                            event_type: "mouse_up".to_string(),
                            point: location,
                        })
                        .unwrap();
                        app.lock()
                            .unwrap()
                            .emit_all("window_manager", format!("{}", json));
                        *inner = None;
                        // println!("on up {:?}", inner);
                    }
                    NSEventType::NSLeftMouseDragged => {
                        let current_win = get_active_window().unwrap();
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

                        if (is_moving) {
                            let json = serde_json::to_string(&MouseEvent {
                                event_type: "dragging".to_string(),
                                point: location,
                            })
                            .unwrap();
                            app.lock()
                                .unwrap()
                                .emit_all("window_manager", format!("{}", json));
                        }

                        // println!("on dragged {:?}", is_moving)
                    }
                    _ => {}
                };

                None
            },
        )
    }
}
