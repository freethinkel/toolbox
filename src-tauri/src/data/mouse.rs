use serde::{Deserialize, Serialize};

use super::frame::Point;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MouseEvent {
    pub monitor_id: String,
    pub point: Point,
    pub event_type: u64,
}
