import React from "react";
import SoundfontPlayer from "soundfont-player";
import { MidiNoteConsumer } from "react-piano";

import { MidiSender } from "./@types";

enum Format {
  "mp3",
  "ogg"
}

enum Soundfont {
  "MusyngKite",
  "FluidR3_GM"
}

type OwnProps = {
  instrumentName: SoundfontPlayer.InstrumentName;
  hostname?: string;
  format?: Format;
  soundfont?: Soundfont;
  audioContext: AudioContext;
  midiIn: MidiSender;
};

type State = {
  activeAudioNodes: {
    [key: string]: SoundfontPlayer.Player;
  };
  instrument: SoundfontPlayer.Player | null;
};

class SoundfontProvider extends React.Component<OwnProps, State> {
  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    instrumentName: "acoustic_grand_piano",
    hostname: "https://d1pzp51pvbm36p.cloudfront.net"
  };

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      activeAudioNodes: {} as State["activeAudioNodes"],
      instrument: null
    };
  }

  async componentDidMount() {
    await this.loadInstrument(this.props.instrumentName);
    this.props.midiIn({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }

  componentDidUpdate(prevProps: OwnProps, prevState: State) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = async (instrumentName: SoundfontPlayer.InstrumentName) => {
    // Re-trigger loading state
    this.setState({
      instrument: null
    });

    const instrument = await SoundfontPlayer.instrument(
      this.props.audioContext,
      instrumentName,
      {
        format: this.props.format,
        soundfont: this.props.soundfont,
        nameToUrl: (name: string, soundfont: string, format: string) => {
          return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
        }
      }
    );

    this.setState({
      instrument
    });
  };

  playNote: MidiNoteConsumer = async midiNumber => {
    await this.props.audioContext.resume();

    if (this.state.instrument !== null) {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode
        })
      });
    }
  };

  stopNote: MidiNoteConsumer = async midiNumber => {
    await this.props.audioContext.resume();

    if (!this.state.activeAudioNodes[midiNumber]) {
      return;
    }
    const audioNode = this.state.activeAudioNodes[midiNumber];
    audioNode.stop();
    this.setState({
      activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
        [midiNumber]: null
      })
    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = async () => {
    await this.props.audioContext.resume();

    const activeAudioNodes = Object.values(this.state.activeAudioNodes);
    activeAudioNodes.forEach(node => {
      if (node) {
        node.stop();
      }
    });
    this.setState({
      activeAudioNodes: {}
    });
  };

  render() {
    return <div />;
  }
}

export default SoundfontProvider;
