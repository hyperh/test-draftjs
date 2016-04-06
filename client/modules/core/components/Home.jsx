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
        strategy: this.isBlockLocked.bind(this),
        component: LockedBlock,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      isEditing: false,
      releaseLockOnBlur: true,
    };
    this.locks = [];
  }

  isBlockLocked(contentBlock, callback) {
    const {user} = this.props;
    const locks = this.locks;
    if (user && locks.length > 0) {
      const lockedByOthers = R.filter(lock => lock.userId !== user._id, locks);
      const lockedBlocks = lockedByOthers.map(lock => lock.blockKey);

      const currentBlockKey = contentBlock.getKey();
      const isLocked = R.contains(currentBlockKey, lockedBlocks);
      if (isLocked) {
        callback(0, contentBlock.getLength());
        return;
      }
    }
  }

  onChange(rawId, editorState) {
    const {editBlock, user, requestBlockLock, releaseBlockLocks} = this.props;

    console.log(`onChange`);
    console.log(user);

    if (rawId) {
      this.setState({editorState});

      const selectionState = editorState.getSelection();

      // If highlight text, anchor is start of selection, focus is end
      // If no highlight, then anchor = focus
      const anchorKey = selectionState.getAnchorKey();
      const focusKey = selectionState.getFocusKey();

      requestBlockLock(anchorKey, user);

      const hasFocus = selectionState.getHasFocus();
      console.log(`hasFocus ${hasFocus}`);
      this.setState({isEditing: true});
      if (this.state.releaseLockOnBlur) {
        if (!hasFocus) { releaseBlockLocks(user); }
      }

      const contentState = editorState.getCurrentContent();
      const rawDraftContentState = convertToRaw(contentState);
      const block = R.find(R.propEq('key', anchorKey), rawDraftContentState.blocks);

      editBlock(rawId, user, rawDraftContentState, block);

      console.log(`anchorKey ${anchorKey}, focusKey ${focusKey}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isEditing) {
      const {contentState} = nextProps;
      if (contentState) {
        this.locks = nextProps.locks;
        const {editorState} = this.state;
        const newState = EditorState.push(editorState, contentState);
        this.setState({editorState: newState});
      }
    }
  }

  render() {
    const {
      create, rawDraftContentStates, select, rawId, remove, login, user
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

        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
            ref={ref => this.editor = ref}
          />
        </div>
        <input type="text" ref={ x => this._lockBlockId = x } />

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

const LockedBlock = (props) => {
  return (
    <div contentEditable={false} style={{color: 'red'}}>
      {props.children}
    </div>
  );
};
