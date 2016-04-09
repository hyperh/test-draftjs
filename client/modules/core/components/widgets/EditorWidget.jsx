import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';

export default class EditorWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    const {
      widget,
      update
    } = this.props;

    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);

    update(widget._id, raw);
    this.setState({editorState});
  }


  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
