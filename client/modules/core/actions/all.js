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

  edit({Meteor}, rawId, rawDraftContentState, user) {
    Meteor.call('edit', {rawId, rawDraftContentState, user});
  },

  select({LocalState}, id) {
    LocalState.set('selectedId', id);
  },

  remove({Meteor, LocalState}, rawId) {
    const selectedId = LocalState.get('selectedId');
    if (selectedId === rawId) { LocalState.set('selectedId', undefined); }

    Meteor.call('remove', {rawId});
  },

  requestLock({Meteor, LocalState}, rawId, user, callback) {
    if (rawId && user) {
      Meteor.call('requestLock', {rawId, user}, (err, res) => {
        if (err) { alert(err); }
        else {
          LocalState.set('canEdit', res);
          if (callback) { callback(); }
        }
      });
    }
  },

  releaseLock({Meteor, LocalState}, rawId, user) {
    if (rawId && user) {
      Meteor.call('releaseLock', {rawId, user});
      LocalState.set('canEdit', false);
    }
  },

  login({Meteor, LocalState, FlowRouter}, usernameOrEmail, password) {
    // Meteor.loginWithPassword(usernameOrEmail, password, (err) => {
    //   if (err) { alert(err); }
    // });
    if (usernameOrEmail === 'alice') {
      LocalState.set('fakeUser', {
        _id: 0,
        username: usernameOrEmail
      });
    }
    else if (usernameOrEmail === 'bob') {
      LocalState.set('fakeUser', {
        _id: 1,
        username: usernameOrEmail
      });
    }
  },


  requestBlockLock({Meteor, LocalState}, blockKey, user) {
    if (blockKey && user) {
      Meteor.call('requestBlockLock', {blockKey, user}, (err) => {
        if (err) { alert(err); }
      });
    }
  },

  releaseBlockLocks({Meteor}, user) {
    if (user) {
      Meteor.call('releaseBlockLocks', {user}, (err) => {
        if (err) { alert(err); }
      });
    }
  },

  editBlock({Meteor}, rawId, rawContentState, user, blockKey) {
    if (user) {
      Meteor.call('editBlock', {rawId, rawContentState, user, blockKey});
    }
  }
};
