#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod data;
mod extensions;
mod patch_window;
mod playground;

use data::frame::Point;
use patch_window::{overlay::patch_overlay_window, statusbar::patch_statusbar_window};
#[cfg(debug_assertions)]
use playground::playground;
use tauri::{ActivationPolicy, Manager, SystemTray, SystemTrayEvent};

use crate::commands::{
    accessibility_element::{accessibility_element_set_frame, accessibility_element_under_cursor},
    nscolor::nscolor_get_accent,
    nsevent::{
        nsevent_add_global_monitor_for_events, nsevent_mouse_location, nsevent_remove_monitor,
    },
    nsscreen::{nsscreen_get_screens, nsscreen_main},
    nswindow::{nswindow_set_decorations, nswindow_set_frame},
};

fn main() {
    let tray = SystemTray::new();
    #[cfg(debug_assertions)]
    playground();

    tauri::Builder::default()
        .setup(|app| {
            app.set_activation_policy(ActivationPolicy::Accessory);
            let main_window = app.get_window("main").unwrap();
            let statusbar_window = app.get_window("statusbar").unwrap();
            patch_statusbar_window(statusbar_window);
            patch_overlay_window(main_window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            nsscreen_get_screens,
            nsscreen_main,
            nsevent_mouse_location,
            nswindow_set_frame,
            nswindow_set_decorations,
            nsevent_add_global_monitor_for_events,
            nsevent_remove_monitor,
            nscolor_get_accent,
            accessibility_element_under_cursor,
            accessibility_element_set_frame
        ])
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position, size: _, ..
            } => {
                if let Ok(_) = app.emit_all(
                    "on_statusbar_click",
                    &Point {
                        x: position.x,
                        y: position.y,
                    },
                ) {}
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
