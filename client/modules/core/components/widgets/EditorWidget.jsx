import React from 'react';
import R from 'ramda';
import { Editor, EditorState, ContentState } from 'draft-js';
import { convertToRaw, convertFromRaw } from 'draft-js';

export default class EditorWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.widget ?
        this._getNewState(EditorState.createEmpty(), props.widget.data) :
        EditorState.createEmpty()
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    const {
      widget,
      update
    } = this.props;

    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);

    update(widget._id, raw);
    this.setState({editorState});
  }

  _mergeBlockArrays(editorState, newBlocks, selectedBlocks) {
    const contentState = editorState.getCurrentContent();

    return newBlocks.map( newBlock => {
      const key = newBlock.getKey();
      const selectedBlock = contentState.getBlockForKey(key);
      const isSelected = R.contains(key, selectedBlocks.map(x => x.getKey()));

      return isSelected ? selectedBlock : newBlock;
    });
  }

  _getNewState(editorState, raw) {
    // Getting current data
    const currentSelectionState = editorState.getSelection();

    // Get the two block arrays and then merge them to form a new one
    const newContentBlocks = convertFromRaw(raw);       // from server
    const selectedBlocks = getSelectedBlocks(editorState);    // from user selection
    const newBlockArray = this._mergeBlockArrays.bind(this)(
      editorState, newContentBlocks, selectedBlocks
    );

    // Wrapping it all back up into an EditorState object
    const newContentState = ContentState.createFromBlockArray(newBlockArray);
    const newEditorState = EditorState.push(editorState, newContentState);

    const hasFocus = currentSelectionState.getHasFocus();
    const maintainSelection = hasFocus ? EditorState.forceSelection : EditorState.acceptSelection;
    const newState = maintainSelection(newEditorState, currentSelectionState);
    return newState;
  }

  _injectChanges(editorState, raw) {
    const newState = this._getNewState(editorState, raw);
    this.setState({editorState: newState});
  }

  componentWillReceiveProps(nextProps) {
    const { widget } = nextProps;
    this._injectChanges.bind(this)(this.state.editorState, widget.data);
  }

  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
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
