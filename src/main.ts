import { PlatformView } from "@/modules/shared/models/platform-view";
import { init as initOverlay } from "@/modules/overlay";
import { init as initStatusbar } from "@/modules/statusbar";
import "./style.css";

const key = PlatformView.getKey();

const handler = {
  main: initOverlay,
  statusbar: initStatusbar,
}[key];

if (handler) {
  const el = document.getElementById("root");

  handler(el);
}
