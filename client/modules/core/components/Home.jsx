import React from 'react';
import {Editor, EditorState, convertToRaw} from 'draft-js';
import Login from './Login.jsx';
import ListItem from './ListItem.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const {edit, lock, unlock} = this.props;

    this.state = {
      editorState: EditorState.createEmpty(),
      isEditing: false
    };

    // id must be bound in render, can't use from constructor props
    this.onChange = (rawId, editorState) => {
      if (rawId) {
        this.setState({editorState});

        const hasFocus = editorState.getSelection().getHasFocus();
        this.setState({isEditing: hasFocus});
        if (hasFocus) { lock(rawId); }
        else { unlock(rawId); }

        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);

        edit(rawId, rawContentState);
      }
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
    const {
      create, rawDraftContentStates, select, rawId, remove, login, user, selectedLock
    } = this.props;

    const readOnly = selectedLock ? selectedLock.userId !== user._id : false;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <h1>Draft.js Editor {rawId}</h1>
        {selectedLock ? `Locked by ${selectedLock.username}` : null}
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
            readOnly={readOnly}
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
