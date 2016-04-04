import {EditorState, convertToRaw} from 'draft-js';

export default {
  create({Meteor, LocalState}) {
    const editorState = EditorState.createEmpty();
    const contentState = editorState.getCurrentContent();
    const rawDraftContentState = convertToRaw(contentState);
    Meteor.call('create', {rawDraftContentState}, (err, res) => {
      if (err) { alert(err); }
      else { LocalState.set('selectedId', res); }
    });
  },

  edit({Meteor}, id, rawDraftContentState) {
    Meteor.call('edit', {id, rawDraftContentState});
  },

  select({LocalState}, id) {
    LocalState.set('selectedId', id);
  }
};
