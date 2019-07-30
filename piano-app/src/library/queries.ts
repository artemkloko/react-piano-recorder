import gql from "graphql-tag";

export const GET_RECORDINGS = gql`
  query GetRecordingsQuery {
    recordings {
      _id
      createdAt
      events {
        note
        time
        duration
      }
      duration
      title
    }
  }
`;

export const ADD_RECORDING = gql`
  mutation AddRecordingMutation($recording: InputRecording) {
    addRecording(recording: $recording) {
      createdAt
      events {
        note
        time
        duration
      }
      duration
      title
    }
  }
`;
