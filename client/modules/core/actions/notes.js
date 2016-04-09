export default {
  create({Meteor, LocalState}) {
    Meteor.call('create', (err, res) => {
      if (err) { alert(err); }
      else { LocalState.set('noteId', res); }
    });
  },

  select({LocalState}, noteId) {
    LocalState.set('noteId', noteId);
  },

  remove({Meteor, LocalState}, noteId) {
    const selectedId = LocalState.get('noteId');
    if (selectedId === noteId) { LocalState.set('noteId', undefined); }

    Meteor.call('remove', {noteId});
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

  addWidget({Meteor}, noteId, type) {
    Meteor.call('addWidget', {noteId, type}, err => {
      if (err) { alert(err); }
    });
  },

  removeWidget({Meteor}, noteId, widgetId) {
    Meteor.call('removeWidget', {noteId, widgetId}, err => {
      if (err) { alert(err); }
    });
  },

  moveWidget({Meteor}, noteId, widgetId, position) {
    Meteor.call('moveWidget', {noteId, widgetId, position}, err => {
      if (err) { alert(err); }
    });
  }
};
