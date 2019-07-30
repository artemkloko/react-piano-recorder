import React from "react";
import {
  Piano,
  MidiNumbers,
  KeyboardShortcuts,
  MidiNumber,
  MidiNoteConsumer
} from "react-piano";

import { MidiReceiver, MidiSender } from "./@types";

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("f4")
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW
});

interface MyPianoProps {
  midiOut: MidiReceiver;
  midiIn: MidiSender;
}

interface MyPianoState {
  activeNotes: MidiNumber[];
}

export class MyPiano extends React.Component<MyPianoProps, MyPianoState> {
  constructor(props: MyPianoProps) {
    super(props);
    this.state = {
      activeNotes: []
    };
  }

  async componentDidMount() {
    this.props.midiIn({
      isLoading: false,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }

  playNote: MidiNoteConsumer = midiNumber => {
    this.setState(currentState => ({
      activeNotes: [...currentState.activeNotes, midiNumber]
    }));
  };

  stopNote: MidiNoteConsumer = midiNumber => {
    this.setState(currentState => ({
      activeNotes: currentState.activeNotes.filter(
        activeNote => activeNote !== midiNumber
      )
    }));
  };

  stopAllNotes = () => {
    this.setState(currentState => ({
      activeNotes: []
    }));
  };

  render() {
    return (
      <Piano
        disabled={false}
        noteRange={noteRange}
        playNote={this.props.midiOut.playNote}
        stopNote={this.props.midiOut.stopNote}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
        activeNotes={this.state.activeNotes}
      />
    );
  }
}

export default MyPiano;
