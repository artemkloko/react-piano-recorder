declare module "react-piano" {
  export type MidiNumber = number;
  export type MidiString = string;

  export const MidiNumbers: {
    fromNote: (MidiString) => MidiNumber;
  };

  export type KeyboardConfig = Array<{
    natural: string;
    flat: string;
    sharp: string;
  }>;
  export interface KeyboardShortcut {
    key: string;
    midiNumber: MidiNumber;
  }

  export const KeyboardShortcuts: {
    create: ({
      firstNote: MidiNumber,
      lastNote: MidiNumber,
      keyboardConfig: KeyboardConfig
    }) => KeyboardShortcut[];
    BOTTOM_ROW: KeyboardConfig;
    HOME_ROW: KeyboardConfig;
    QWERTY_ROW: KeyboardConfig;
  };

  export type MidiNoteConsumer = (midiNumber: MidiNumber) => void;

  export interface PianoProps {
    disabled: boolean;
    noteRange: { first: MidiNumber; last: MidiNumber };
    playNote: MidiNoteConsumer;
    stopNote: MidiNoteConsumer;
    width: number;
    keyboardShortcuts: KeyboardShortcut[];
    activeNotes?: Array<MidiNumber>;
  }

  export class Piano extends React.Component<PianoProps> {}

  export const ReactPiano: {
    MidiNumbers: MidiNumbers;
    KeyboardShortcuts: KeyboardShortcuts;
    Piano: Piano;
  };

  export default ReactPiano;
}
