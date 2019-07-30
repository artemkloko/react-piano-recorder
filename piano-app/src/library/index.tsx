import React, { ReactNode } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Query } from "react-apollo";

import { Recording, MidiEvent } from "../@types";
import RecordingForm from "./RecordingForm";
import { LibraryRecording } from "./LibraryRecording";

import { GetRecordingsQuery } from "../@types/graphql";
import { GET_RECORDINGS } from "./queries";

type RenderProps = {
  addRecording: (recording: Recording) => void;
};

type LibraryProps = {
  onPlay: (events: MidiEvent[]) => void;
  onStop: () => void;
  isPlaying: boolean;
  render: (renderProps: RenderProps) => ReactNode;
  recordings?: Recording[];
};

type LibraryState = {
  recordings: Recording[];
  currentlyPlaying: Recording | null;
  newRecording: Recording | null;
};

export class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      recordings: props.recordings || [],
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

export const LibraryWithQuery = (props: LibraryProps) => {
  return (
    <Query<GetRecordingsQuery> query={GET_RECORDINGS}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        if (data && data.recordings) {
          return (
            <Library {...props} recordings={data.recordings as Recording[]} />
          );
        }
      }}
    </Query>
  );
};

export default LibraryWithQuery;
