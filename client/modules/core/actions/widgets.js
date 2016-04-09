export default {
  add({Meteor}, noteId, type) {
    Meteor.call('widgets.add', {noteId, type}, err => {
      if (err) { alert(err); }
    });
  },

  remove({Meteor}, noteId, widgetId) {
    Meteor.call('widgets.remove', {noteId, widgetId}, err => {
      if (err) { alert(err); }
    });
  },

  move({Meteor}, noteId, widgetId, position) {
    Meteor.call('widgets.move', {noteId, widgetId, position}, err => {
      if (err) { alert(err); }
    });
  }
};
