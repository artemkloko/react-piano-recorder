import React from "react";
import {
  Piano as ReactPiano,
  KeyboardShortcuts,
  MidiNumbers
} from "react-piano";
import SoundfontProvider from "./SoundfontProvider";
import "react-piano/dist/styles.css";

declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "http://gleitz.github.io/midi-js-soundfonts";

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("f4")
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW
});

function Piano() {
  return (
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      hostname={soundfontHostname}
      render={({ isLoading, playNote, stopNote }) => (
        <div>
          <ReactPiano
            disabled={isLoading}
            noteRange={noteRange}
            playNote={playNote}
            stopNote={stopNote}
            width={1000}
            keyboardShortcuts={keyboardShortcuts}
          />
        </div>
      )}
    />
  );
}

export default Piano;
