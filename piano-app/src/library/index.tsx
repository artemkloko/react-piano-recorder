import React, { ReactNode } from "react";
import { RecordingForm } from "./RecordingForm";
import { LibraryRecording } from "./LibraryRecording";
import { Recording, MidiEvent } from "../types";
import ListGroup from "react-bootstrap/ListGroup";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

interface LibraryProps {
  onPlay: (events: MidiEvent[]) => void;
  onStop: () => void;
  isPlaying: boolean;
  render: (renderProps: RenderProps) => ReactNode;
}

interface LibraryState {
  recordings: Recording[];
  currentlyPlaying: Recording | null;
  newRecording: Recording | null;
}

interface RenderProps {
  addRecording: (recording: Recording) => void;
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      recordings: [],
      currentlyPlaying: null,
      newRecording: null
    };
  }

  play = (recording: Recording) => {
    this.props.onPlay(recording.events);
    this.setState({
      currentlyPlaying: recording
    });
  };

  stop = () => {
    this.props.onStop();
    this.setState({
      currentlyPlaying: null
    });
  };

  addRecording: RenderProps["addRecording"] = recording => {
    this.setState({
      newRecording: recording
    });
  };

  saveRecording = (recording: Recording) => {
    this.setState({
      recordings: [...this.state.recordings, recording],
      newRecording: null
    });
  };

  cancelSaving = () => {
    this.setState({
      newRecording: null
    });
  };

  render() {
    const recordings = this.state.recordings.map((recording, i) => (
      <ListGroup.Item>
        <LibraryRecording
          key={i}
          recording={recording}
          play={this.play}
          stop={this.stop}
          isPlaying={
            this.state.currentlyPlaying === recording && this.props.isPlaying
          }
        />
      </ListGroup.Item>
    ));

    return (
      <div>
        {this.props.render({ addRecording: this.addRecording })}
        <ListGroup>
          {recordings.length > 0 ? (
            recordings
          ) : (
            <ListGroup.Item>No recordings yet...</ListGroup.Item>
          )}
        </ListGroup>
        {this.state.newRecording !== null && (
          <RecordingForm
            recording={this.state.newRecording}
            onConfirm={this.saveRecording}
            onCancel={this.cancelSaving}
          />
        )}
      </div>
    );
  }
}

const getRecordings = gql`
  {
    recordings {
      id
      breed
    }
  }
`;

const enhancedComponent = compose(
  graphql(getRecordings)
  // renderWhileLoading(LoadingPlaceholder, "user")
)(Library);

export default enhancedComponent;
