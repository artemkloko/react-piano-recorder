/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRecordingsQuery
// ====================================================

export interface GetRecordingsQuery_recordings_events {
  __typename: "MidiEvent";
  note: number;
  time: number;
  duration: number;
}

export interface GetRecordingsQuery_recordings {
  __typename: "Recording";
  _id: string;
  createdAt: any;
  events: GetRecordingsQuery_recordings_events[];
  duration: number;
  title: string;
}

export interface GetRecordingsQuery {
  recordings: (GetRecordingsQuery_recordings | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRecordingMutation
// ====================================================

export interface AddRecordingMutation_addRecording_events {
  __typename: "MidiEvent";
  note: number;
  time: number;
  duration: number;
}

export interface AddRecordingMutation_addRecording {
  __typename: "Recording";
  createdAt: any;
  events: AddRecordingMutation_addRecording_events[];
  duration: number;
  title: string;
}

export interface AddRecordingMutation {
  addRecording: AddRecordingMutation_addRecording | null;
}

export interface AddRecordingMutationVariables {
  recording?: InputRecording | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface InputMidiEvent {
  note: number;
  time: number;
  duration: number;
}

export interface InputRecording {
  createdAt: any;
  events: InputMidiEvent[];
  duration: number;
  title: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
