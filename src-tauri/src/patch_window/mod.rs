use cocoa::{
    appkit::{
        NSColor, NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior, NSWindowStyleMask,
        NSWindowTitleVisibility,
    },
    base::{id, YES},
};
use objc::{msg_send, sel, sel_impl};
use raw_window_handle::{HasRawWindowHandle, RawWindowHandle};
use tauri::Window as TauriWindow;

pub trait PatchWindow {
    fn clear_decoration(&self);
}

impl PatchWindow for TauriWindow {
    fn clear_decoration(&self) {
        let ns_win = self.ns_window().unwrap() as id;
        unsafe {
            let raw_window = match self.raw_window_handle() {
                RawWindowHandle::AppKit(handle) => handle.ns_window as id,
                _ => return,
            };
            let () = msg_send![raw_window, invalidateShadow];

            ns_win.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
            );

            ns_win.setHasShadow_(false);

            // ns_win.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            // ns_win.setIgnoresMouseEvents_(true)
        }
    }
}
