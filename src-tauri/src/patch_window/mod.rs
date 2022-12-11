use cocoa::{
    appkit::{
        NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior, NSWindowStyleMask,
        NSWindowTitleVisibility,
    },
    base::id,
};
use objc::{msg_send, sel, sel_impl};
use tauri::Window as TauriWindow;

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
            ns_win.setHasShadow_(false);

            // ns_win.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            // ns_win.setIgnoresMouseEvents_(true)
        }
    }
}
