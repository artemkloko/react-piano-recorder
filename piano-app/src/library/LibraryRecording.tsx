import React from "react";
import { Recording } from "../types";
import { secondsToClock } from "../utils";
import { FaPlay, FaStop } from "react-icons/fa";
import Button from "react-bootstrap/Button";

interface LibraryRecordingProps {
  recording: Recording;
  isPlaying: boolean;
  play: (recording: Recording) => void;
  stop: () => void;
}

export class LibraryRecording extends React.Component<LibraryRecordingProps> {
  play = () => {
    this.props.play(this.props.recording);
  };

  render = () => {
    return (
      <span>
        {this.props.isPlaying === false ? (
          <Button variant="primary" size="sm" onClick={this.play}>
            <FaPlay />
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={this.props.stop}>
            <FaStop />
          </Button>
        )}
        {" " + this.props.recording.title}
        {this.props.recording.duration &&
          " - " + secondsToClock(this.props.recording.duration)}
        <span style={{ float: "right" }}>
          {this.props.recording.createdAt.toLocaleString()}
        </span>
      </span>
    );
  };
}

export default LibraryRecording;
