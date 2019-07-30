import React, { ReactNode } from "react";
import { MidiNoteConsumer } from "react-piano";
import "react-piano/dist/styles.css";

import { MidiSender, MidiReceiver } from "./@types";

type AddMidiIn = (name: string) => MidiSender;
type AddMidiOut = (deviceNames: string[]) => MidiReceiver;

interface Props {
  render: (renderProps: RenderProps) => ReactNode;
}

interface State {
  receivers: { [name: string]: MidiReceiver };
  senders: { [name: string]: MidiReceiver };
}

interface RenderProps {
  addMidiIn: AddMidiIn;
  addMidiOut: AddMidiOut;
}

export class MidiRouter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      receivers: {},
      senders: {}
    };
  }

  addMidiIn: AddMidiIn = name => {
    return ({ isLoading, playNote, stopNote, stopAllNotes }) => {
      this.setState(currentState => ({
        receivers: {
          ...currentState.receivers,
          [name]: {
            isLoading,
            playNote,
            stopNote,
            stopAllNotes
          }
        }
      }));
    };
  };

  addMidiOut: AddMidiOut = deviceNames => {
    return {
      isLoading: false,
      playNote: this.handleNotePress(deviceNames),
      stopNote: this.handleNoteRelease(deviceNames),
      stopAllNotes: this.handleStopAllNotes(deviceNames)
    };
  };

  handleNotePress = (deviceNames: string[]): MidiNoteConsumer => midiNumber => {
    for (let deviceName of deviceNames) {
      if (this.state.receivers[deviceName]) {
        this.state.receivers[deviceName].playNote(midiNumber);
      }
    }
  };

  handleNoteRelease = (
    deviceNames: string[]
  ): MidiNoteConsumer => midiNumber => {
    for (let deviceName of deviceNames) {
      if (this.state.receivers[deviceName]) {
        this.state.receivers[deviceName].stopNote(midiNumber);
      }
    }
  };

  handleStopAllNotes = (deviceNames: string[]) => () => {
    for (let deviceName of deviceNames) {
      if (this.state.receivers[deviceName]) {
        this.state.receivers[deviceName].stopAllNotes();
      }
    }
  };

  render() {
    return this.props.render({
      addMidiIn: this.addMidiIn,
      addMidiOut: this.addMidiOut
    });
  }
}

export default MidiRouter;
