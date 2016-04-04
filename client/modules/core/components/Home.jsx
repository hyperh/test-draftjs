import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {edit} = this.props;

    this.state = {editorState: EditorState.createEmpty(), isEditing: false};
    this.onChange = (editorState) => {
      this.setState({editorState});
      
      const hasFocus = editorState.getSelection().getHasFocus();
      this.setState({isEditing: hasFocus ? true : false});

      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);

      edit(rawContentState);
    };
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.isEditing) {
      const {contentState} = nextProps;
      const {editorState} = this.state;
      const newState = EditorState.push(editorState, contentState);
      this.setState({editorState: newState});
    }
  }

  render() {
    return (
      <div id="main-page">
        <h1>Draft.js Editor</h1>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
