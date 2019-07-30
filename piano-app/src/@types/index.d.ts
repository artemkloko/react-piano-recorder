declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

export interface MidiPressEvent {
  note: MidiNumber;
  absoluteTime: number;
}

export interface MidiEvent {
  note: MidiNumber;
  time: number;
  duration: number;
}

export interface Recording {
  createdAt: Date;
  events: MidiEvent[];
  duration?: number;
  title?: string;
}

export interface MidiReceiver {
  isLoading: boolean;
  playNote: MidiNoteConsumer;
  stopNote: MidiNoteConsumer;
  stopAllNotes: () => void;
}

export type MidiSender = (midiReceiver: MidiReceiver) => void;
