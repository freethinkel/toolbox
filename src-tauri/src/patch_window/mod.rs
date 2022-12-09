use cocoa::{
    appkit::{NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior},
    base::id,
};
use tauri::Window as TauriWindow;

pub trait PatchWindow {
    fn clear_decoration(&self);
}

impl PatchWindow for TauriWindow {
    fn clear_decoration(&self) {
        let ns_win = self.ns_window().unwrap() as id;
        unsafe {
            // ns_win.setLevel_((NSMainMenuWindowLevel + 1) as i64);
            ns_win.setCollectionBehavior_(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
            );
            // ns_win.setIgnoresMouseEvents_(true)
        }
    }
}
