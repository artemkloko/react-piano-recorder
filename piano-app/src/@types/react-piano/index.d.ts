declare module "react-piano" {
  export type MidiNumber = number;
  export type MidiString = string;

  export const MidiNumbers: {
    fromNote: (MidiString) => MidiNumber;
  };

  type KeyboardConfig = Array<{ natural: string; flat: string; sharp: string }>;

  export const KeyboardShortcuts: {
    create: ({
      firstNote: MidiNumber,
      lastNote: MidiNumber,
      keyboardConfig: KeyboardConfig
    }) => void;
    BOTTOM_ROW: KeyboardConfig;
    HOME_ROW: KeyboardConfig;
    QWERTY_ROW: KeyboardConfig;
  };

  export interface PianoProps {
    disabled: boolean;
    noteRange: { first: MidiNumber; last: MidiNumber };
    playNote: (midiString: MidiString) => void;
    stopNote: (midiString: MidiString) => void;
    width: number;
    keyboardShortcuts: ReturnType<typeof KeyboardShortcuts["create"]>;
  }

  export class Piano extends React.Component<PianoProps> {}

  export const ReactPiano: {
    MidiNumbers: MidiNumbers;
    KeyboardShortcuts: KeyboardShortcuts;
    Piano: Piano;
  };

  export default ReactPiano;
}
