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

  _mergeBlockArrays(newBlocks, selectedBlocks, newContentState) {
    const contentState = this.state.editorState.getCurrentContent();
    const clientBlocks = contentState.getBlocksAsArray();
    const getKeys = R.map(x => x.getKey());

    const newBlockKeys = getKeys(newBlocks);
    const clientBlockKeys = getKeys(clientBlocks);
    const selectedBlockKeys = getKeys(selectedBlocks);

    const blocksDeleted = R.difference(clientBlockKeys, newBlockKeys);
    const blocksAdded = R.difference(newBlockKeys, clientBlockKeys);
    const blocksAddedAfter = blocksAdded.map( key => newContentState.getKeyBefore(key));

    // make temp array
    let temp = [];

    // if a new block is to be added to the top, push to temp
    const topBlockIndex = R.indexOf(null, blocksAddedAfter);
    if (topBlockIndex >= 0) {
      const key = blocksAdded[topBlockIndex];
      temp.push(newContentState.getBlockForKey(key));
    }

    // for each client block
    clientBlocks.map( clientBlock => {
      const key = clientBlock.getKey();
      const getServerBlock = myKey => newContentState.getBlockForKey(myKey);

      // if user is currently on this block
      const isSelected = R.contains(key, selectedBlockKeys);
      if (isSelected) {
        // push client block
        temp.push(clientBlock);
      } else {
        // push server block
        temp.push(getServerBlock(key));
      }

      // check if there is a block to be added after this one
      const newBlockAfterIndex = R.indexOf(key, blocksAddedAfter);
      if (newBlockAfterIndex >= 0) {
        // yes, get the key of the block we want to add and push to temp
        const addKey = blocksAdded[newBlockAfterIndex];
        temp.push(getServerBlock(addKey));
      }
    });

    const finalArray = temp.map( block => {
      const key = block.getKey();
      if (R.contains(key, blocksDeleted)) {
        return null;
      }
      return block;
    });

    return R.difference(finalArray, [null]);

    // return newBlocks.map( newBlock => {
    //   const key = newBlock.getKey();
    //   const clientBlock = contentState.getBlockForKey(key);
    //   const isSelected = R.contains(key, selectedBlocks.map(x => x.getKey()));

    //   return isSelected ? clientBlock : newBlock;
    // });
  }

  _injectChanges(contentState) {
    // Getting current data
    const { editorState } = this.state;
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
    const newState = maintainSelection(newEditorState, currentSelectionState);

    this.setState({editorState: newState});
  }

  componentWillReceiveProps(nextProps) {
    this.locks = nextProps.locks;

    // if (!this.state.isEditing) {
      if (nextProps.raw && nextProps.raw.authorId !== this.props.user._id) {
        const contentBlocks = convertFromRaw(nextProps.raw);
        const contentState = ContentState.createFromBlockArray(contentBlocks);
        this._injectChanges.bind(this)(contentState);
        // const {editorState} = this.state;
        // const newState = EditorState.push(editorState, contentState);
        // this.setState({editorState: newState});
      }
    // }
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
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={myKeyBindingFn.bind(this)}
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
