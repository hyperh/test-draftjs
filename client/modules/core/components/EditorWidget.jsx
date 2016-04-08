import React from 'react';
import Widget from './Widget.jsx';
import {Editor, EditorState} from 'draft-js';

export default class EditorWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  render() {
    return (
      <Widget>
        <Editor editorState={this.state.editorState} />
      </Widget>
    );
  }
}
