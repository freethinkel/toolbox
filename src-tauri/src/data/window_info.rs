use super::frame::Frame;
use core_graphics::window::CGWindowID;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct WindowInfo {
    pub frame: Frame,
    pub window_id: CGWindowID,
    pub pid: i32,
}
