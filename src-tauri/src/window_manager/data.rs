use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize)]
pub struct Size {
    pub width: f64,
    pub height: f64,
}

#[derive(Serialize, Deserialize)]
pub struct WindowInfo {
    pub point: Point,
    pub id: String,
    pub pid: u64,
}

#[derive(Serialize, Deserialize)]
pub struct MouseEvent {
    pub point: Point,
    pub event_type: String,
    pub window_info: Option<WindowInfo>,
}

#[derive(Serialize, Deserialize)]
pub struct SetWindowPosition {
    pub id: String,
    pub pid: i32,
    pub size: Size,
    pub position: Point,
}

#[derive(Serialize, Deserialize)]
pub struct Frame {
    pub size: Size,
    pub position: Point,
}

#[derive(Serialize, Deserialize)]
pub struct Screen {
    pub visibleFrame: Frame,
    pub frame: Frame,
}
