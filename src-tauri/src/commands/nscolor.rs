use crate::extensions::nscolor::NSAColor;
use cocoa::base::nil;
use tauri::command;

#[command]
pub fn nscolor_get_accent() -> String {
    unsafe {
        return NSAColor::accentColor(nil);
    }
}
