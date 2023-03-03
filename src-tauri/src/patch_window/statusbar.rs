use cocoa::{
    appkit::{
        NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior, NSWindowStyleMask,
        NSWindowTitleVisibility,
    },
    base::{id, NO, YES},
};
use tauri::Window;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

pub fn patch_statusbar_window(window: Window) {
    unsafe {
        if let Ok(ns_window) = window.ns_window() {
            let ns_window = ns_window as id;
            let _ = apply_vibrancy(
                &window,
                NSVisualEffectMaterial::Popover,
                Some(NSVisualEffectState::Active),
                None,
            );
            ns_window.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                    | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
            );
            ns_window.setStyleMask_(
                NSWindowStyleMask::NSFullSizeContentViewWindowMask
                    | NSWindowStyleMask::NSTitledWindowMask,
            );
            ns_window.setTitlebarAppearsTransparent_(YES);
            ns_window.setShowsResizeIndicator_(NO);
            ns_window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
            ns_window.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            ns_window.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
            );
            ns_window.setHidesOnDeactivate_(YES);
        }
    }
}
