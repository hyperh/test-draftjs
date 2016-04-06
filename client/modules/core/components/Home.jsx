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
    const {edit, releaseLock, user, canEdit} = this.props;
    if (rawId) {
      this.setState({editorState});

      const selectionState = editorState.getSelection();
      const anchorKey = selectionState.getAnchorKey();
      const focusKey = selectionState.getFocusKey();

      const hasFocus = selectionState.getHasFocus();
      this.setState({isEditing: hasFocus && canEdit});

      if (!hasFocus) { releaseLock(rawId, user); }

      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);

      edit(rawId, rawContentState);

      console.log(`anchorKey ${anchorKey}, focusKey ${focusKey}`);
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

  editorClick() {
    const {requestLock, rawId, user} = this.props;
    requestLock(rawId, user, () => this.editor.focus());
  }

  render() {
    const {
      create, rawDraftContentStates, select, rawId, remove, login, user, canEdit, lock
    } = this.props;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <button onClick={login.bind(null, 'alice', 1)}>Alice</button>
        <button onClick={login.bind(null, 'bob', 1)}>Bob</button>

        <h1>Draft.js Editor {rawId}</h1>
        {rawId && !canEdit ? `Locked` : null}
        {lock && !canEdit ? ` by ${lock.username}` : null}
        <div className="editor" onClick={this.editorClick.bind(this)}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
            readOnly={!canEdit}
            ref={ref => this.editor = ref}
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
