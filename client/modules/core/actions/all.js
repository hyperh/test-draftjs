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

  remove({Meteor, LocalState}, id) {
    const selectedId = LocalState.get('selectedId');
    if (selectedId === id) { LocalState.set('selectedId', undefined); }

    Meteor.call('remove', {id});
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
};
