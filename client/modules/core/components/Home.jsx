import React from 'react';
import R from 'ramda';
import {Editor, EditorState, convertToRaw, CompositeDecorator, ContentState} from 'draft-js';
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
      releaseLockOnBlur: true,
    };
    this.locks = [];
  }

  onChange(rawId, editorState) {
    const {
      user,
      requestAndReleaseLocks, releaseAllLocks, releaseOtherLocks,
      editBlock
    } = this.props;

    console.log(getSelectedBlocks(editorState));
    console.log(`onChange`);
    console.log(user);

    if (rawId) {
      this.setState({editorState});
      const selectionState = editorState.getSelection();
      const hasFocus = selectionState.getHasFocus();

      if (hasFocus) {
        const currentLocks = this.locks.map(lock => lock.blockKey);
        const desiredLocks = getSelectedBlocks(editorState).map(block => block.getKey());
        const requestedLocks = R.difference(desiredLocks, currentLocks);
        const toReleaseLocks = R.difference(currentLocks, desiredLocks);

        requestAndReleaseLocks(rawId, requestedLocks, toReleaseLocks, user);
        // releaseLocks(rawId, toReleaseLocks, user);

        console.log('-----');
        console.log('currentLocks');
        console.log(currentLocks);
        console.log('desiredLocks');
        console.log(desiredLocks);
        console.log('requestedLocks');
        console.log(requestedLocks);
        console.log('toReleaseLocks');
        console.log(toReleaseLocks);

      } else {
        if (this.state.releaseLockOnBlur) { releaseAllLocks(user); }
      }

      const contentState = editorState.getCurrentContent();
      const rawDraftContentState = convertToRaw(contentState);
      const anchorKey = selectionState.getAnchorKey();
      const focusKey = selectionState.getFocusKey();
      const block = R.find(R.propEq('key', anchorKey), rawDraftContentState.blocks);
      editBlock(rawId, user, rawDraftContentState, block);

      console.log(`anchorKey ${anchorKey}, focusKey ${focusKey}`);
    }
  }

  _mergeBlockArrays(newBlocks, selectedBlocks) {
    const contentState = this.state.editorState.getCurrentContent();

    return newBlocks.map( newBlock => {
      const key = newBlock.getKey();
      const selectedBlock = contentState.getBlockForKey(key);
      const isSelected = R.contains(key, selectedBlocks.map(x => x.getKey()));

      return isSelected ? selectedBlock : newBlock;
    });
  }

  _injectChanges(contentState) {
    // Getting current data
    const { editorState } = this.state;
    const currentSelectionState = editorState.getSelection();

    // Get the two block arrays and then merge them to form a new one
    const newContentBlocks = contentState.getBlocksAsArray();       // from server
    const selectedBlocks = getSelectedBlocks(editorState);    // from user selection
    const newBlockArray = this._mergeBlockArrays.bind(this)(newContentBlocks, selectedBlocks);

    // Wrapping it all back up into an EditorState object
    const newContentState = ContentState.createFromBlockArray(newBlockArray);
    const newEditorState = EditorState.push(editorState, newContentState);
    const newState = EditorState.forceSelection(newEditorState, currentSelectionState);

    this.setState({editorState: newState});
  }

  componentWillReceiveProps(nextProps) {
    this.locks = nextProps.locks;

    const {contentState} = nextProps;
    if (contentState) {
      const {editorState} = this.state;
      const newState = EditorState.push(editorState, contentState);
      this.setState({editorState: newState});
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

function getSelectedBlocks(editorState) {
  const selectionState = editorState.getSelection();

  const hasFocus = selectionState.getHasFocus();
  const start = selectionState.getStartKey();
  const end = selectionState.getEndKey();

  if (start && hasFocus) {
    const contentState = editorState.getCurrentContent();
    const blockArray = contentState.getBlocksAsArray();

    /* eslint-disable curly */
    let index = {start: null, end: null};
    blockArray.map((block, i) => {
      if (block.getKey() === start) index.start = i;
      if (block.getKey() === end) index.end = i;
    }); /* eslint-enable */

    return blockArray.filter((_, i) => i >= index.start && i <= index.end);
  }
  return [];
}

function isBlockLocked(contentBlock, callback) {
  const {user} = this.props;

  if (user && this.locks.length > 0) {
    const lockedKeys = this.locks
      .filter(lock => lock.userId !== user._id)
      .map(lock => lock.blockKey);

    const containsCurrentKey = R.contains(contentBlock.getKey());
    const isLocked = containsCurrentKey(lockedKeys);
    if (isLocked) {
      callback(0, contentBlock.getLength());
      return;
    }
  }
}

const LockedBlock = (props) => {
  return (
    <div contentEditable={false} style={{color: 'red'}}>
      {props.children}
    </div>
  );
};
