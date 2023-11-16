import type { Readable } from "svelte/store";

export type SegmentedControlContext = {
  value: Readable<string>;
  onChange: (value: string) => void;
  onControlTapDown: (value: string) => void;
  onControlTapUp: (value: string) => void;
};

export const CONTEXT_KEY = "segmented_control_context";
