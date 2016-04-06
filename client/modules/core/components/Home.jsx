import React from 'react';
import R from 'ramda';
import {Editor, EditorState, convertToRaw, CompositeDecorator} from 'draft-js';
import Login from './Login.jsx';
import ListItem from './ListItem.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: isBlockLocked.bind(this),
        component: LockedBlock,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      isEditing: false,
      releaseLockOnBlur: true
    };
  }

  onChange(rawId, editorState) {
    const {edit, releaseLock, user, canEdit} = this.props;
    if (rawId) {
      this.setState({editorState});

      const selectionState = editorState.getSelection();

      // If highlight text, anchor is start of selection, focus is end
      // If no highlight, then anchor = focus
      const anchorKey = selectionState.getAnchorKey();
      const focusKey = selectionState.getFocusKey();

      const hasFocus = selectionState.getHasFocus();
      this.setState({isEditing: hasFocus && canEdit});

      if (this.state.releaseLockOnBlur) {
        if (!hasFocus) { releaseLock(rawId, user); }
      }

      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);

      edit(rawId, rawContentState, user);

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

  setLockedBlock() {
    const blockId = this._lockBlockId.value;
    this.lockedBlock = blockId;
    console.log(this.lockedBlock);
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
        <div>
          <button onClick={() => this.setState({releaseLockOnBlur: !this.state.releaseLockOnBlur})}>
            Release lock on blur: {this.state.releaseLockOnBlur ? 'true' : 'false'}
          </button>
        </div>

        {rawId && lock && !canEdit ? `Locked by ${lock.username}` : null}
        {lock && canEdit ? `I can edit.` : null}
        <div className="editor" onClick={this.editorClick.bind(this)}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
            readOnly={!canEdit}
            ref={ref => this.editor = ref}
          />
        </div>
        <input type="text" ref={ x => this._lockBlockId = x } />
        <button onClick={this.setLockedBlock.bind(this)}>Set Locked Block</button>
        <button onClick={create}>New editor</button>
        {rawDraftContentStates.map(
          raw => {
            return (
              <ListItem raw={raw} select={select} remove={remove} selectedRawId={rawId} />
            );
          }
        )}
      </div>
    );
  }
}

function isBlockLocked(contentBlock, callback) {
  // const lockedBlocks = this.props.lockedBlockKeys;
  const lockedBlocks = [ this.lockedBlock ];
  const currentBlockKey = contentBlock.getKey();
  const isBlocked = R.contains(currentBlockKey, lockedBlocks);
  if (isBlocked) {
    callback(0, contentBlock.getLength());
    return;
  }
}

const LockedBlock = (props) => {
  return (
    <div contentEditable={false} style={{color: 'red'}}>
      {props.children}
    </div>
  );
};
