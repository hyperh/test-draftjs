import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {edit} = this.props;

    this.state = {
      editorState: EditorState.createEmpty(),
      isEditing: false
    };
    this.onChange = (id, editorState) => {
      this.setState({editorState});

      const hasFocus = editorState.getSelection().getHasFocus();
      this.setState({isEditing: hasFocus});

      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);

      edit(id, rawContentState);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isEditing) {
      const {contentState} = nextProps;
      if (contentState) {
        const {editorState} = this.state;
        const newState = EditorState.push(editorState, contentState);
        this.setState({editorState: newState});
      }
    }
  }

  render() {
    const {create, rawDraftContentStates, select, id} = this.props;
    const list = () => (
      rawDraftContentStates.map(raw =>
        <div onClick={select.bind(null, raw._id)}>
          {raw._id}
        </div>
      )
    );

    return (
      <div id="main-page">
        <h1>Draft.js Editor {id}</h1>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, id)}
          />
        </div>
        <button onClick={create}>New editor</button>
        { list() }
      </div>
    );
  }
}
