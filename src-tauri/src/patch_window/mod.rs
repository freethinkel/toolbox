use cocoa::{
    appkit::{
        NSApp, NSApplication, NSApplicationActivationPolicy, NSColor, NSImage,
        NSMainMenuWindowLevel, NSPanel, NSWindow, NSWindowCollectionBehavior, NSWindowStyleMask,
        NSWindowTitleVisibility,
    },
    base::{id, nil, YES},
};
use objc::{class, msg_send, sel, sel_impl};
use raw_window_handle::{HasRawWindowHandle, RawWindowHandle};
use tauri::{utils::config::BundleConfig, Window as TauriWindow};

mod action_handler;

pub trait PatchWindow {
    fn clear_decoration(&self);
    fn remove_title(&self);
}

impl PatchWindow for TauriWindow {
    fn remove_title(&self) {
        let ns_win = self.ns_window().unwrap() as id;
        unsafe {
            ns_win.setStyleMask_(
                NSWindowStyleMask::NSFullSizeContentViewWindowMask
                    | NSWindowStyleMask::NSTitledWindowMask,
            );
            ns_win.setTitlebarAppearsTransparent_(true);
            ns_win.setShowsResizeIndicator_(false);
            ns_win.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
            ns_win.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            ns_win.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
            );
            ns_win.setHidesOnDeactivate_(true);
            ns_win.setMovableByWindowBackground_(true);
        }
    }

    fn clear_decoration(&self) {
        let ns_win = self.ns_window().unwrap() as id;
        unsafe {
            let () = msg_send![ns_win, invalidateShadow];

            ns_win.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
            );

            // let plist = BundleConfig::default();
            // plist.ns_win.setAcceptsMouseMovedEvents_(false);

            ns_win.setHasShadow_(false);

            // ns_win.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            // ns_win.setIgnoresMouseEvents_(true)
        }
    }
}
