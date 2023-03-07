use cocoa::base::YES;
use cocoa::{
    appkit::{NSWindow, NSWindowCollectionBehavior},
    base::{id, NO},
};
use objc::{msg_send, sel, sel_impl};
use tauri::Window;

pub fn patch_overlay_window(window: Window) {
    unsafe {
        let ns_window = window.ns_window().unwrap() as id;

        let () = msg_send![ns_window, invalidateShadow];
        ns_window.setHasShadow_(NO);
        ns_window.setCollectionBehavior_(
            NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
        );
        let is_debug = false;
        #[cfg(not(debug_assertions))]
        {
            let is_debug = false;
        }

        if !is_debug {
            ns_window.setIgnoresMouseEvents_(YES);
            ns_window.setLevel_(20);
        }
    }
}
