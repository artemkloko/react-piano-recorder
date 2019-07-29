import React, { ReactNode } from "react";
import SoundfontPlayer from "soundfont-player";
import { PianoProps, MidiString } from "react-piano";

enum Format {
  "mp3",
  "ogg"
}

enum Soundfont {
  "MusyngKite",
  "FluidR3_GM"
}

interface OwnProps {
  instrumentName: SoundfontPlayer.InstrumentName;
  hostname: string;
  format?: Format;
  soundfont?: Soundfont;
  audioContext: AudioContext;
  render: (opts: {
    isLoading: boolean;
    playNote: PianoProps["playNote"];
    stopNote: PianoProps["stopNote"];
    stopAllNotes?: () => void;
  }) => ReactNode;
}

interface StateProps {
  activeAudioNodes: {
    [key: string]: SoundfontPlayer.Player;
  };
  instrument: SoundfontPlayer.Player | null;
}

class SoundfontProvider extends React.Component<OwnProps, StateProps> {
  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    instrumentName: "acoustic_grand_piano"
  };

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      activeAudioNodes: {} as StateProps["activeAudioNodes"],
      instrument: null
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps: OwnProps, prevState: StateProps) {
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

  playNote = async (midiString: MidiString) => {
    await this.props.audioContext.resume();

    if (this.state.instrument !== null) {
      const audioNode = this.state.instrument.play(midiString);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiString]: audioNode
        })
      });
    }
  };

  stopNote = async (midiString: MidiString) => {
    await this.props.audioContext.resume();

    if (!this.state.activeAudioNodes[midiString]) {
      return;
    }
    const audioNode = this.state.activeAudioNodes[midiString];
    audioNode.stop();
    this.setState({
      activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
        [midiString]: null
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
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }
}

export default SoundfontProvider;
