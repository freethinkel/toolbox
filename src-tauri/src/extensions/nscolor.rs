use cocoa::{appkit::CGFloat, base::id};
use objc::{class, msg_send, sel, sel_impl};

pub trait NSAColor: Sized {
    unsafe fn accent_color(_: Self) -> Self;
    unsafe fn start_listen(_: Self);
    unsafe fn to_rgb(color: Self) -> String;
}

impl NSAColor for id {
    unsafe fn to_rgb(color: Self) -> String {
        let cg_color: id = msg_send![color, CGColor];
        let color_id: cocoa::base::id =
            unsafe { msg_send![class!(CIColor), colorWithCGColor: cg_color] };
        let r: CGFloat = msg_send![color_id, red];
        let g: CGFloat = msg_send![color_id, green];
        let b: CGFloat = msg_send![color_id, blue];
        let a: CGFloat = msg_send![color_id, alpha];

        let formatted = format!("rgba({}, {}, {}, {})", r * 255.0, g * 255.0, b * 255.0, a);

        return formatted;
    }

    unsafe fn accent_color(_: Self) -> Self {
        unsafe {
            let color: id = msg_send![class!(NSColor), controlAccentColor];
            return color;
        }
    }

    unsafe fn start_listen(_: Self) {}
}
