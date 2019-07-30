import React from "react";
import { MidiNoteConsumer } from "react-piano";
import { FaStop, FaCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";

import { MidiSender, MidiPressEvent, MidiEvent, Recording } from "./@types";
import { secondsToClock } from "./utils";

interface RecorderProps {
  midiIn: MidiSender;
  audioContext: AudioContext;
  onStopRecording?: (recording: Recording) => void;
}

interface RecorderState {
  isRecording: boolean;
  start: number;
  displayDuration: number;
  stillPressed: {
    [note: string]: MidiPressEvent;
  };
  recording: Recording | null;
  clock: NodeJS.Timeout;
}

export class Recorder extends React.Component<RecorderProps, RecorderState> {
  constructor(props: RecorderProps) {
    super(props);
    this.state = {
      isRecording: false,
      start: 0,
      displayDuration: 0,
      stillPressed: {},
      recording: null,
      clock: setInterval(this.displayRecordingDuration, 100)
    };
  }

  componentDidMount = () => {
    this.props.midiIn({
      isLoading: false,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.clock);
  };

  displayRecordingDuration = () => {
    if (this.state.isRecording) {
      this.setState({
        displayDuration: this.props.audioContext.currentTime - this.state.start
      });
    }
  };

  playNote: MidiNoteConsumer = midiNumber => {
    this.setState(currentState => {
      return {
        stillPressed: {
          ...currentState.stillPressed,
          [midiNumber]: {
            note: midiNumber,
            absoluteTime: this.props.audioContext.currentTime
          }
        }
      };
    });
  };

  stopNote: MidiNoteConsumer = midiNumber => {
    this.setState(currentState => {
      let { isRecording, start, stillPressed, recording } = currentState;

      if (isRecording && recording !== null) {
        recording = {
          ...recording,
          events: [
            ...recording.events,
            this.midiPressEventToMidiEvent(stillPressed[midiNumber], start)
          ]
        };
      }

      delete stillPressed[midiNumber];

      return {
        stillPressed,
        recording
      };
    });
  };

  stopAllNotes = () => {
    this.setState(currentState => {
      let { start, stillPressed, recording } = { ...currentState };
      const pressedEvents = Object.keys(stillPressed).map(midiNumber =>
        this.midiPressEventToMidiEvent(stillPressed[midiNumber], start)
      );
      if (recording !== null) {
        recording = {
          ...recording,
          events: [...recording.events, ...pressedEvents]
        };
      }
      return {
        recording
      };
    });
  };

  midiPressEventToMidiEvent = (
    midiPressEvent: MidiPressEvent,
    start: RecorderState["start"]
  ): MidiEvent => {
    const time =
      midiPressEvent.absoluteTime >= start
        ? midiPressEvent.absoluteTime - start
        : 0;
    const duration = this.props.audioContext.currentTime - start - time;
    return {
      note: midiPressEvent.note,
      time: time,
      duration: duration
    };
  };

  startRecording = () => {
    this.setState({
      isRecording: true,
      start: this.props.audioContext.currentTime,
      recording: {
        createdAt: new Date(),
        events: []
      }
    });
  };

  stopRecording = () => {
    this.stopAllNotes();
    this.setState(currentState => {
      let { start, recording } = { ...currentState };
      if (recording !== null) {
        recording.duration = this.props.audioContext.currentTime - start;
        if (this.props.onStopRecording) {
          this.props.onStopRecording(recording);
        }
      }
      return {
        isRecording: false,
        displayDuration: 0,
        recording
      };
    });
  };

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>
            {this.state.isRecording === false ? (
              <Button variant="primary" size="lg" onClick={this.startRecording}>
                <FaCircle />
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={this.stopRecording}>
                <FaStop />
              </Button>
            )}
            {" " + secondsToClock(this.state.displayDuration)}
          </h1>
          <p>
            Just hit the record button and let the magic happen.
            <br />
            You can resample your recordings by playing them while recoding.
          </p>
        </Jumbotron>
      </div>
    );
  }
}

export default Recorder;
