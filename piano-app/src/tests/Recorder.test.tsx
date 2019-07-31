import React from "react";
import Enzyme, { ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Recorder, RecorderProps, RecorderState } from "../Recorder";

Enzyme.configure({ adapter: new Adapter() });

describe("<Recorder />", () => {
  let wrapper: ShallowWrapper<RecorderProps, RecorderState, Recorder>;

  beforeEach(() => {
    wrapper = Enzyme.shallow(
      <Recorder
        audioContext={{ currentTime: 10 } as AudioContext}
        midiIn={() => {}}
        onStopRecording={() => {}}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("midiPressEventToMidiEvent()", () => {
    it("transforms midiPressEvent to midiEvent", () => {
      const midiEvent = wrapper
        .instance()
        .midiPressEventToMidiEvent({ note: 50, absoluteTime: 15 }, 16, 12);

      expect(midiEvent).toEqual({
        note: 50,
        time: 3,
        duration: 1
      });
    });
  });
});

export default undefined;
