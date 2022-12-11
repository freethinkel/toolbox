use crate::window_manager::{data::Screen, WindowManager};
use cocoa::base::id;
use tauri::{command, Window};

#[command]
pub async fn change_window_position(payload: String) {
    let parsed = serde_json::from_str(payload.as_str());
    match parsed {
        Ok(data) => {
            WindowManager::set_window_position(data);
        }
        Err(_) => {}
    }
}
#[command]
pub fn set_current_window_position(window: Window, payload: String) {
    let ns_window = window.ns_window();
    let rect = serde_json::from_str(payload.as_str());
    match rect {
        Ok(rect) => match ns_window {
            Ok(window) => {
                WindowManager::set_current_window_position(window as id, rect);
            }
            Err(_) => {}
        },
        Err(_) => {}
    }
}

#[command]
pub fn get_screens() -> Option<Vec<Screen>> {
    let screens = WindowManager::get_screens();
    Some(screens)
}
