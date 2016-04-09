import {Meteor} from 'meteor/meteor';
import {Notes, Locks, Widgets} from '/lib/collections';
import R from 'ramda';
import {check} from 'meteor/check';

export default function () {
  Meteor.methods({
    create() {
      const id = Notes.insert({widgetIds: []});
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
      const newWidgets = R.append(widgetId, note.widgetIds);
      Notes.update(noteId, {
        $set: { widgetIds: newWidgets }
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
      const toDeleteIndex = R.findIndex(id => id === widgetId, note.widgetIds);
      const newWidgets = R.remove(toDeleteIndex, 1, note.widgetIds);

      Notes.update(noteId, {
        $set: { widgetIds: newWidgets }
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
      const indexToRemove = R.findIndex(i => i === widgetId)(note.widgetIds);
      const widgetsLessRemoved = R.remove(indexToRemove, 1, note.widgetIds);
      const newOrderedWidgets = R.insert(position, widgetId, widgetsLessRemoved);

      note.update(noteId, {
        $set: { widgetIds: newOrderedWidgets }
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
