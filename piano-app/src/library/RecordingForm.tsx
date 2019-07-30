import React from "react";
import { Mutation } from "react-apollo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.css";

import { Recording } from "../@types";
import {
  AddRecordingMutation,
  AddRecordingMutationVariables
} from "../@types/graphql";
import { ADD_RECORDING } from "./queries";

interface RecordingFormProps {
  recording: Recording;
  onConfirm: (recording: Recording) => void;
  onCancel: () => void;
}

interface RecordingFormState {
  title: string;
}

export class RecordingForm extends React.Component<
  RecordingFormProps,
  RecordingFormState
> {
  constructor(props: RecordingFormProps) {
    super(props);
    this.state = {
      title: this.props.recording.title || ""
    };
  }

  setTitle = (event: React.FormEvent<FormControl & FormControlProps>) => {
    if (typeof event.currentTarget.value === "string") {
      this.setState({
        title: event.currentTarget.value
      });
    }
  };

  cancel = () => {
    this.props.onCancel();
  };

  save = () => {
    const recording = {
      ...this.props.recording,
      title: this.state.title
    };
    this.props.onConfirm(recording);
  };

  render() {
    return (
      <Modal show={true} onHide={this.cancel}>
        <Form onSubmit={this.save}>
          <Modal.Body>
            <Form.Group controlId="title">
              <Form.Label>Recording title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a title for your recording"
                value={this.state.title}
                onChange={this.setTitle}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.cancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.save}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export const RecordingFormWithQuery = (props: RecordingFormProps) => {
  return (
    <Mutation<AddRecordingMutation, AddRecordingMutationVariables>
      mutation={ADD_RECORDING}
    >
      {(addRecording, { data }) => (
        <RecordingForm
          {...props}
          onConfirm={recording => {
            addRecording({
              variables: { recording } as AddRecordingMutationVariables
            });
            props.onConfirm(recording);
          }}
        />
      )}
    </Mutation>
  );
};

export default RecordingFormWithQuery;
