import React from 'react';
import R from 'ramda';
import _ from 'lodash';
import {Editor, EditorState, convertToRaw, CompositeDecorator, ContentState} from 'draft-js';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import {convertFromRaw} from 'draft-js';
import Login from './Login.jsx';
import ListItem from './ListItem.jsx';
import WhyDidYouUpdateMixin from '/lib/WhyDidYouUpdateMixin';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.decorator = new CompositeDecorator([
      {
        strategy: isBlockLocked.bind(this),
        component: LockedBlock,
      },
    ]);

    this.state = {
      editorState: undefined,
      releaseLockOnBlur: true,
      isEditing: false
    };
    this.locks = [];
    // this.componentDidUpdate = WhyDidYouUpdateMixin.componentDidUpdate.bind(this);
  }

  onChange(rawId, editorState) {
    const {
      user,
      requestAndReleaseLocks, releaseAllLocks, releaseOtherLocks,
      editBlock
    } = this.props;

    // console.log('-----');

    // console.log(getSelectedBlocks(editorState));
    // console.log(`onChange`);
    // console.log(user);

    if (rawId) {
      this.setState({editorState});
      const selectionState = editorState.getSelection();
      const hasFocus = selectionState.getHasFocus();

      // const prevEditorState = this.state.editorState;
      // const prevHasFocus = prevEditorState.getSelection().getHasFocus();
      // const userTriggeredFocus = !prevHasFocus && hasFocus;

      if (hasFocus) {
        const currentLocks = this.locks.map(lock => lock.blockKey);
        const desiredLocks = getSelectedBlocks(editorState).map(block => block.getKey());
        const requestedLocks = R.difference(desiredLocks, currentLocks);
        const toReleaseLocks = R.difference(currentLocks, desiredLocks);

        requestAndReleaseLocks(rawId, requestedLocks, toReleaseLocks, user);
        // releaseLocks(rawId, toReleaseLocks, user);

        // console.log('currentLocks');
        // console.log(currentLocks);
        // console.log('desiredLocks');
        // console.log(desiredLocks);
        // console.log('requestedLocks');
        // console.log(requestedLocks);
        // console.log('toReleaseLocks');
        // console.log(toReleaseLocks);

      } else if (this.state.releaseLockOnBlur) {
        releaseAllLocks(user);
      }

      const contentState = editorState.getCurrentContent();
      const rawDraftContentState = convertToRaw(contentState);
      const anchorKey = selectionState.getAnchorKey();
      const focusKey = selectionState.getFocusKey();
      const block = R.find(R.propEq('key', anchorKey), rawDraftContentState.blocks);
      editBlock(rawId, user, rawDraftContentState, block);

      // console.log(`anchorKey ${anchorKey}, focusKey ${focusKey}`);
      // console.log(`block`);
      // console.log(block);
    }
  }

  _mergeBlockArrays(newBlocks, selectedBlocks) {
    const contentState = this.state.editorState.getCurrentContent();
    const selectedBlockKeys = selectedBlocks.map(x => x.getKey());

    return newBlocks.map( newBlock => {
      const key = newBlock.getKey();
      const clientBlock = contentState.getBlockForKey(key);
      const isSelected = R.contains(key, selectedBlockKeys);

      return isSelected ? clientBlock : newBlock;
    });
  }

  _injectChanges(contentState) {
    // Getting current data
    const { editorState } = this.state;
    let newState;
    if (editorState) {
      const currentSelectionState = editorState.getSelection();

      // Get the two block arrays and then merge them to form a new one
      const newContentBlocks = contentState.getBlocksAsArray();       // from server
      console.log(`-----`);
      console.log(`_injectChanges`);
      console.log(`newContentBlocks ${newContentBlocks.length}`);
      const selectedBlocks = getSelectedBlocks(editorState);    // from user selection
      const newBlockArray = this._mergeBlockArrays.bind(this)(newContentBlocks, selectedBlocks, contentState);

      // Wrapping it all back up into an EditorState object
      const newContentState = ContentState.createFromBlockArray(newBlockArray);
      const newEditorState = EditorState.push(editorState, newContentState);

      const hasFocus = currentSelectionState.getHasFocus();
      const maintainSelection = hasFocus ? EditorState.forceSelection : EditorState.acceptSelection;
      newState = maintainSelection(newEditorState, currentSelectionState);
    }
    else {
      const editorStateEmpty = EditorState.createEmpty(this.decorator);
      newState = EditorState.push(editorStateEmpty, contentState);
    }

    this.setState({editorState: newState});
  }

  componentWillReceiveProps(nextProps) {
    this.locks = nextProps.locks;
    const {editorState} = this.state;

    const newRawContent = nextProps.raw;
    const userId = this.props.user ? this.props.user._id : nextProps.user._id;
    const clientIsAuthor = newRawContent && newRawContent.authorId === userId;

    if (!clientIsAuthor && nextProps.raw) {
      const contentBlocks = convertFromRaw(nextProps.raw);
      const newContentState = ContentState.createFromBlockArray(contentBlocks);

      if (editorState) {
        const currentContentState = editorState.getCurrentContent();
        // make sure server is up-to-date with client blocks before injecting
        const blockKeysMatch = checkServerHasClientKeys(newContentState, currentContentState);
        if (blockKeysMatch) {
          this._injectChanges.bind(this)(newContentState);
        }
      } else {
        this._injectChanges.bind(this)(newContentState);
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
          {this.state.editorState ?
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange.bind(this, rawId)}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={myKeyBindingFn.bind(this)}
              ref={ref => this.editor = ref}
            /> : null
          }
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

function handleKeyCommand(command) {
  if (command === 'delete-backspace') {
    return true;
  }
  if (command === 'space') {
    return true;
  }
  if (command === 'cutting' || command === 'pasting') {
    return true;
  }
  return false;
}

function checkServerHasClientKeys(newContent, currentContent) {
  function getBlockKeyArray(contentState) {
    const blockArray = contentState.getBlocksAsArray();
    return blockArray.map( x => x.getKey());
  }

  const newKeys = getBlockKeyArray(newContent);
  const currentKeys = getBlockKeyArray(currentContent);

  console.log(`newKeys`);
  console.log(newKeys);
  console.log(`currentKeys`);
  console.log(currentKeys);

  // server has all the keys that the client has
  return R.difference(currentKeys, newKeys).length === 0;
}

function myKeyBindingFn(e) {
  const {user} = this.props;
  const {editorState} = this.state;
  const locks = this.locks;

  if (isFocusOnLocked(editorState, locks, user)) {
    const {hasCommandModifier} = KeyBindingUtil;
    const deleting = e.keyCode === 8 || e.keyCode === 46; // backspace or delete
    const pasting = e.keyCode === 86 && hasCommandModifier(e);  // command + 'v'
    const cutting = e.keyCode === 88 && hasCommandModifier(e);  // command + 'x'
    const space = e.keyCode === 32; // space
    /* eslint-disable curly */
    if (deleting) return 'delete-backspace';
    if (pasting) return 'pasting';
    if (cutting) return 'cutting';
    if (space) return 'space';
    /* eslint-enable */
  }
  return getDefaultKeyBinding(e);
}

function isFocusOnLocked(editorState, locks, user) {
  const selectionState = editorState.getSelection();

  const hasFocus = selectionState.getHasFocus();
  const focusKey = selectionState.getFocusKey();
  const lockedKeys = locks
    .filter(lock => lock.userId !== user._id)
    .map(lock => lock.blockKey);

  if (hasFocus && R.contains(focusKey, lockedKeys)) {
    return true;
  }
  console.log('isFocusOnLocked: ' + false);
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

    return blockArray.filter((__, i) => i >= index.start && i <= index.end);
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
