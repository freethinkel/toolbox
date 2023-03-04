use active_win_pos_rs::get_active_window;
use cocoa::appkit::CGPoint;
use core_graphics::geometry::CGSize;
use tauri::command;

use crate::{
    data::{
        frame::{Frame, Point, Size},
        window_info::WindowInfo,
    },
    extensions::accessibility_elements::{get_window_from_id, set_position, set_size},
};

#[command]
pub fn accessibility_element_under_cursor() -> Result<WindowInfo, ()> {
    let win = get_active_window();
    let result = match win {
        Ok(win) => Ok(WindowInfo {
            pid: win.process_id as i32,
            window_id: win.window_id.parse().unwrap_or(0),
            frame: Frame {
                size: Size {
                    width: win.position.width,
                    height: win.position.height,
                },
                position: Point {
                    x: win.position.x,
                    y: win.position.y,
                },
            },
        }),
        Err(_) => Err(()),
    };

    return result;
}

#[command]
pub fn accessibility_element_set_frame(window_info: WindowInfo) {
    let window = get_window_from_id(window_info.pid, window_info.window_id);
    match window {
        Ok(window) => {
            set_position(
                window,
                CGPoint {
                    x: window_info.frame.position.x,
                    y: window_info.frame.position.y,
                },
            );
            set_size(
                window,
                CGSize {
                    width: window_info.frame.size.width,
                    height: window_info.frame.size.height,
                },
            );
        }
        Err(_) => {}
    }
}
