use crate::window_manager::{
    data::{Frame, Screen, SetWindowPosition},
    WindowManager,
};
use cocoa::{
    appkit::NSWindow,
    base::{id, NO, YES},
};
use tauri::{command, AppHandle, Manager, Window};

pub static mut WINDOW_MANAGER_GLOBAL: Option<WindowManager> = None;

#[command]
pub async fn change_window_position(payload: SetWindowPosition) {
    WindowManager::set_window_position(payload);
}
#[command]
pub fn set_current_window_position(window: Window, payload: Frame) {
    let ns_window = window.ns_window();
    match ns_window {
        Ok(window) => {
            WindowManager::set_current_window_position(window as id, payload);
        }
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
            }
            None => {}
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
pub fn send_message(app: AppHandle, payload: String) {
    app.emit_all("broadcast", payload);
}

#[command]
pub fn set_debug_mode(app: AppHandle, enabled: bool) {
    let main_ns_win: id = app.get_window("main").unwrap().ns_window().unwrap() as id;
    unsafe {
        if enabled {
            main_ns_win.setLevel_(0);
            main_ns_win.setIgnoresMouseEvents_(NO);
        } else {
            main_ns_win.setLevel_(99999);
            main_ns_win.setIgnoresMouseEvents_(YES);
        }
    }

    app.windows().iter().for_each(|(_, window)| {
        if enabled {
            window.open_devtools();
        } else {
            window.close_devtools();
        }
    });
}
