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

  select({LocalState}, id) {
    LocalState.set('selectedId', id);
  },

  remove({Meteor, LocalState}, rawId) {
    const selectedId = LocalState.get('selectedId');
    if (selectedId === rawId) { LocalState.set('selectedId', undefined); }

    Meteor.call('remove', {rawId});
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

  requestAndReleaseLocks({Meteor}, rawId, requestedBlockKeys, releaseBlockKeys, user) {
    if (user) {
      Meteor.call('requestAndReleaseLocks', {rawId, requestedBlockKeys, releaseBlockKeys, user}, (err) => {
        if (err) { alert(err); }
      });
    }
  },

  // releaseLocks({Meteor}, rawId, blockKeys, user) {
  //   if (user) {
  //     Meteor.call('releaseLocks', {rawId, blockKeys, user}, err => {
  //       if (err) { alert(err); }
  //     });
  //   }
  // },

  releaseAllLocks({Meteor}, user) {
    if (user) {
      Meteor.call('releaseAllLocks', {user}, (err) => {
        if (err) { alert(err); }
      });
    }
  },

  releaseOtherLocks({Meteor}, rawId, blockKeys, user) {
    if (user) {
      Meteor.call('releaseOtherLocks', {rawId, blockKeys, user}, (err) => {
        if (err) { alert(err); }
      });
    }
  },

  editBlock({Meteor}, rawId, user, rawDraftContentState, block) {
    if (user) {
      Meteor.call('editBlock', {rawId, user, rawDraftContentState, block});
    }
  }
};
