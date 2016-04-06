import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';
import Login from './Login.jsx';
import ListItem from './ListItem.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      isEditing: false
    };
  }

  onChange(rawId, editorState) {
    const {edit, requestLock, releaseLock, user} = this.props;
    if (rawId) {
      this.setState({editorState});

      const hasFocus = editorState.getSelection().getHasFocus();
      this.setState({isEditing: hasFocus});

      if (hasFocus) { requestLock(rawId, user); }
      else { releaseLock(rawId, user); }

      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);

      edit(rawId, rawContentState);
    }
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
    const {
      create, rawDraftContentStates, select, rawId, remove, login, user, canEdit
    } = this.props;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <h1>Draft.js Editor {rawId}</h1>
        {rawId && !canEdit ? `Locked` : null}
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
          />
        </div>
        <button onClick={create}>New editor</button>
        {rawDraftContentStates.map(
          raw => {
            return (
              <ListItem raw={raw} select={select} remove={remove} />
            );
          }
        )}
      </div>
    );
  }
}
