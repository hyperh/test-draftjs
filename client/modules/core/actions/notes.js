export default {
  create({Meteor, LocalState}) {
    Meteor.call('notes.create', (err, res) => {
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

    Meteor.call('notes.remove', {noteId});
  }
};
