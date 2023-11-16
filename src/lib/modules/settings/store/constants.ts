import { Frame, Position, Size } from "@/modules/shared/models/frame";
import { MappingAction } from "../model/mappings";

export const MAPPING_ACTIONS = [
  new MappingAction(new Frame(new Size(1, 1), new Position(0, 0)), []),

  new MappingAction(new Frame(new Size(0.5, 1), new Position(0, 0)), []),
  new MappingAction(new Frame(new Size(0.5, 1), new Position(0.5, 0)), []),

  new MappingAction(new Frame(new Size(1, 0.5), new Position(0, 0)), []),
  new MappingAction(new Frame(new Size(1, 0.5), new Position(0, 0.5)), []),

  new MappingAction(new Frame(new Size(1 / 6, 1), new Position(0, 0)), []),
  new MappingAction(new Frame(new Size(2 / 3, 1), new Position(1 / 6, 0)), []),
  new MappingAction(
    new Frame(new Size(1 / 6, 1), new Position(1 / 6 + 2 / 3, 0)),
    [],
  ),

  new MappingAction(new Frame(new Size(0.5, 0.5), new Position(0, 0)), []),
  new MappingAction(new Frame(new Size(0.5, 0.5), new Position(0.5, 0)), []),
  new MappingAction(new Frame(new Size(0.5, 0.5), new Position(0, 0.5)), []),
  new MappingAction(new Frame(new Size(0.5, 0.5), new Position(0.5, 0.5)), []),

  new MappingAction(new Frame(new Size(2 / 3, 1), new Position(0, 0)), []),
  new MappingAction(new Frame(new Size(1 / 3, 1), new Position(2 / 3, 0)), []),
];
