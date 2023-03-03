import SegmentedControlWrapper from './SegmentedControl.svelte';
import SegmentedControlButton from './SegmentedControlButton.svelte';

const SegmentedControl: typeof SegmentedControlWrapper & {
	SegmentedButton: typeof SegmentedControlButton;
} = SegmentedControlWrapper as never;

SegmentedControl.SegmentedButton = SegmentedControlButton;

export { SegmentedControl };
