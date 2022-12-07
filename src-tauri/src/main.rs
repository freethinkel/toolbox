#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod window_manager;

use active_win_pos_rs::get_active_window;
use cocoa::{
    appkit::{NSEventMask, NSEventType},
    base::id,
};
use tauri::Manager;
use window_manager::event::{Event, EventMonitor};

fn main() {
    Event::global_monitor(
        NSEventMask::NSLeftMouseDownMask
            | NSEventMask::NSLeftMouseDraggedMask
            | NSEventMask::NSLeftMouseUpMask,
        |event| {
            unsafe {
                let loc = Event::location(event);
                let eventType = Event::eventType(event);
                println!("new event type - {:?} location - {:?}", eventType, loc);
                let win = get_active_window();
                println!("active_window {:?}", win);
            }

            None
        },
    );

    tauri::Builder::default()
        .setup(|app| {
            let app = app.handle();

            app.windows().iter().for_each(|(_, window)| {
                #[cfg(target_os = "macos")]
                {}
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
