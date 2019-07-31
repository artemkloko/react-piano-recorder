import React from "react";

import MidiRouter from "./MidiRouter";
import SoundfontProvider from "./SoundfontProvider";
import Recorder from "./Recorder";
import Piano from "./Piano";
import Player from "./Player";
import Library from "./library";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export class Stage extends React.Component {
  render() {
    return (
      <MidiRouter
        render={({ addMidiIn, addMidiOut }) => (
          <div>
            <SoundfontProvider
              instrumentName="acoustic_grand_piano"
              audioContext={audioContext}
              midiIn={addMidiIn("soundfont")}
            />
            <Piano
              midiIn={addMidiIn("piano")}
              midiOut={addMidiOut(["soundfont", "recorder"])}
            />
            <Player
              audioContext={audioContext}
              midiOut={addMidiOut(["piano"])}
              render={({ play, stop, isPlaying }) => (
                <Library
                  onPlay={play}
                  onStop={stop}
                  isPlaying={isPlaying}
                  render={({ addRecording }) => (
                    <Recorder
                      audioContext={audioContext}
                      midiIn={addMidiIn("recorder")}
                      onStopRecording={addRecording}
                    />
                  )}
                />
              )}
            />
          </div>
        )}
      />
    );
  }
}
