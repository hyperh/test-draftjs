import {Meteor} from 'meteor/meteor';
import {Notes, Locks, Widgets} from '/lib/collections';
import R from 'ramda';
import {check} from 'meteor/check';

export default function () {
  Meteor.methods({
    create() {
      const id = Notes.insert({widgets: []});
      return id;
    }
  });

  Meteor.methods({
    remove({noteId}) {
      check(arguments[0], {
        noteId: String
      });

      Notes.remove(noteId);
    }
  });

  Meteor.methods({
    addWidget({noteId}) {
      check(arguments[0], {
        noteId: String
      });

      const widgetId = Widgets.insert({
        type: 'default',
        noteId
      });

      const note = Notes.findOne(noteId);
      const newWidgets = R.append(widgetId, note.widgets);
      Notes.update(noteId, {
        $set: { widgets: newWidgets }
      });
    }
  });

  Meteor.methods({
    removeWidget({noteId, widgetId}) {
      check(arguments[0], {
        noteId: String,
        widgetId: String
      });

      Widgets.remove(widgetId);

      const note = Notes.findOne(noteId);
      const toDeleteIndex = R.findIndex(id => id === widgetId, note.widgets);
      const newWidgets = R.remove(toDeleteIndex, 1, note.widgets);

      Notes.update(noteId, {
        $set: { widgets: newWidgets }
      });
    }
  });

  Meteor.methods({
    moveWidget({noteId, widgetId, position}) {
      check(arguments[0], {
        noteId: String,
        widgetId: String,
        position: Number
      });

      const note = Notes.findOne(noteId);
      const indexToRemove = R.findIndex(i => i === widgetId)(note.widgets);
      const widgetsLessRemoved = R.remove(indexToRemove, 1, note.widgets);
      const newOrderedWidgets = R.insert(position, widgetId, widgetsLessRemoved);

      note.update(noteId, {
        $set: { widgets: newOrderedWidgets }
      });
    }
  });

  Meteor.methods({
    '_wipeAndInitialize'() {
      Locks.remove({});
      Meteor.users.remove({});

      Accounts.createUser({
        email: 'alice@test.com',
        username: 'alice',
        password: '1'
      });

      Accounts.createUser({
        email: 'bob@test.com',
        username: 'bob',
        password: '1'
      });
    }
  });
}
