import React from 'react';
import R from 'ramda';
import {Editor, EditorState, convertToRaw, CompositeDecorator, ContentState} from 'draft-js';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
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
      releaseLockOnBlur: true,
      isEditing: false
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
        this.setState({isEditing: true});
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

      } else if (this.state.releaseLockOnBlur) {
        releaseAllLocks(user);
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

  handleKeyCommand(command) {
    const {editorState} = this.state;
    const locks = this.locks;
    if (command === 'delete-backspace') {
      if (focusOnLockedBlock(editorState, locks)) {
        return true;
      }
    }
    if (command === 'space') {
      if (focusOnLockedBlock(editorState, locks)) {
        return true;
      }
    }
    if (command === 'cutting' || command === 'pasting') {
      if (focusOnLockedBlock(editorState, locks)) {
        return true;
      }
    }
    return false;
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

    const hasFocus = currentSelectionState.getHasFocus();
    const maintainSelection = hasFocus ? EditorState.forceSelection : EditorState.acceptSelection;
    const newState = maintainSelection(newEditorState, currentSelectionState);

    this.setState({editorState: newState});
  }

  componentWillReceiveProps(nextProps) {
    this.locks = nextProps.locks;

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
      create, rawDraftContentStates, select, rawId, remove, login, user, releaseAllLocks
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

          <button onClick={releaseAllLocks.bind(null, undefined)}>
            Release all locks
          </button>
        </div>

        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this, rawId)}
            handleKeyCommand={this.handleKeyCommand.bind(this)}
            keyBindingFn={myKeyBindingFn}
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

function myKeyBindingFn(e) {
  const {hasCommandModifier} = KeyBindingUtil;
  const deleting = e.keyCode === 8 || e.keyCode === 46; // backspace or delete
  const pasting = e.keyCode === 86 && hasCommandModifier(e);  // 'v'
  const cutting = e.keyCode === 88 && hasCommandModifier(e);  // 'x'
  const space = e.keyCode === 32;
  /* eslint-disable curly */
  if (deleting) return 'delete-backspace';
  if (pasting) return 'pasting';
  if (cutting) return 'cutting';
  if (space) return 'space';
  /* eslint-enable */
  return getDefaultKeyBinding(e);
}

function focusOnLockedBlock(editorState, locks) {
  const selectionState = editorState.getSelection();

  const hasFocus = selectionState.getHasFocus();
  const focusKey = selectionState.getFocusKey();
  const lockedKeys = locks.map(lock => lock.blockKey);

  if (hasFocus && R.contains(focusKey, lockedKeys)) {
    return true;
  }
  return false;
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
