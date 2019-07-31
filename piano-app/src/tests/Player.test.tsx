import React from "react";
import Enzyme, { ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Player, PlayerProps, PlayerState } from "../Player";

Enzyme.configure({ adapter: new Adapter() });

describe("<Player />", () => {
  let wrapper: ShallowWrapper<PlayerProps, PlayerState, Player>;
  const setStateSpy = jest.spyOn(Player.prototype, 'setState');

  const midiOut = {
    isLoading: false,
    playNote: () => {},
    stopNote: () => {},
    stopAllNotes: () => {}
  };

  beforeEach(() => {
    wrapper = Enzyme.shallow(
      <Player
        midiOut={midiOut}
        audioContext={{ currentTime: 10 } as AudioContext}
        render={renderProps => <div children={renderProps} />}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("play()", () => {
    it("sets state with proper schedule", () => {
      wrapper.instance().play([
        {
          note: 50,
          time: 1,
          duration: 2
        },
        {
          note: 60,
          time: 4,
          duration: 8
        }
      ]);
      expect(setStateSpy).toHaveBeenCalledWith({
        isPlaying: true,
        schedule: [
          {
            note: 50,
            absoluteTime: 11,
            action: midiOut.playNote
          },
          {
            note: 50,
            absoluteTime: 13,
            action: midiOut.stopNote
          },
          {
            note: 60,
            absoluteTime: 14,
            action: midiOut.playNote
          },
          {
            note: 60,
            absoluteTime: 22,
            action: midiOut.stopNote
          }
        ]
      });
    });
  });
});

export default undefined;
