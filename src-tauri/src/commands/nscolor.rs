use crate::extensions::nscolor::NSAColor;
use cocoa::base::nil;
use tauri::command;

#[command]
pub fn nscolor_get_accent() -> String {
    unsafe {
        let color = NSAColor::accent_color(nil);

        return NSAColor::to_rgb(color);
    }
}
