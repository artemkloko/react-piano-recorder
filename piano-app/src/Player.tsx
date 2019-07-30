import React, { ReactNode } from "react";
import { MidiNoteConsumer } from "react-piano";

import { MidiReceiver, MidiPressEvent, MidiEvent } from "./@types";

interface PlayerProps {
  midiOut: MidiReceiver;
  audioContext: AudioContext;
  render: (renderProps: RenderProps) => ReactNode;
}

interface PlayerState {
  isPlaying: boolean;
  schedule: Array<
    MidiPressEvent & {
      action: MidiNoteConsumer;
    }
  >;
  clock: NodeJS.Timeout;
}

interface RenderProps {
  play: (events: MidiEvent[]) => void;
  stop: () => void;
  isPlaying: boolean;
}

export class Player extends React.Component<PlayerProps, PlayerState> {
  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      isPlaying: false,
      schedule: [],
      clock: setInterval(this.checkSchedule, 2)
    };
  }

  componentWillUnmount = () => {
    clearInterval(this.state.clock);
  };

  checkSchedule = () => {
    if (this.state.isPlaying === false) {
      return;
    }
    const currentTime = this.props.audioContext.currentTime;
    this.setState(currentState => {
      let { schedule, isPlaying } = currentState;
      while (schedule.length > 0) {
        if (schedule[0].absoluteTime < currentTime) {
          const event = schedule.shift();
          if (event) {
            event.action(event.note);
          }
        } else {
          break;
        }
      }
      isPlaying = schedule.length > 0;
      return {
        isPlaying,
        schedule
      };
    });
  };

  play: RenderProps["play"] = recording => {
    this.props.midiOut.stopAllNotes();
    const currentTime = this.props.audioContext.currentTime;
    const schedule = recording
      .reduce(
        (events, midiEvent) => {
          events.push({
            note: midiEvent.note,
            absoluteTime: currentTime + midiEvent.time,
            action: this.props.midiOut.playNote
          });
          events.push({
            note: midiEvent.note,
            absoluteTime: currentTime + midiEvent.time + midiEvent.duration,
            action: this.props.midiOut.stopNote
          });
          return events;
        },
        [] as PlayerState["schedule"]
      )
      .sort((a, b) => a.absoluteTime - b.absoluteTime);
    this.setState({
      isPlaying: true,
      schedule
    });
  };

  stop = () => {
    this.props.midiOut.stopAllNotes();
    this.setState({
      isPlaying: false,
      schedule: []
    });
  };

  render() {
    return this.props.render({
      play: this.play,
      stop: this.stop,
      isPlaying: this.state.isPlaying
    });
  }
}

export default Player;
