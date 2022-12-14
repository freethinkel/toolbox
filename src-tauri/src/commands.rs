use crate::window_manager::{data::Screen, WindowManager};
use cocoa::base::id;
use tauri::{command, AppHandle, Window, Manager};

pub static mut WINDOW_MANAGER_GLOBAL: Option<WindowManager> = None;

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
pub fn start_window_manager(app: AppHandle) {
    unsafe {
        match &WINDOW_MANAGER_GLOBAL {
            Some(window_manager) => {
                window_manager.stop();
                WINDOW_MANAGER_GLOBAL = None;
            },
            None => {},
        }
    }
    let window_manager = WindowManager::new(app);

    let window_manager = window_manager.start();
    unsafe {
        WINDOW_MANAGER_GLOBAL = Some(window_manager);
    }
}

#[command]
pub fn stop_window_manager() {
    unsafe {
        let window_manager_cloned = &WINDOW_MANAGER_GLOBAL;

        match window_manager_cloned {
            Some(window_manager_cloned) => {
                window_manager_cloned.stop();
                WINDOW_MANAGER_GLOBAL = None;
            }
            None => {}
        }
    }
}

#[command]
pub fn get_screens() -> Option<Vec<Screen>> {
    let screens = WindowManager::get_screens();
    Some(screens)
}


#[command]
pub fn send_message(app: AppHandle, payload: String)  {
    app.emit_all("broadcast", payload);
}
