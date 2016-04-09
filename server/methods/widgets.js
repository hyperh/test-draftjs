import { Meteor } from 'meteor/meteor';
import { Notes, Locks, Widgets } from '/lib/collections';
import R from 'ramda';
import { check, Match } from 'meteor/check';

export default function () {
  Meteor.methods({
    'widgets.add'({noteId, type, data}) {
      check(arguments[0], {
        noteId: String,
        type: String,
        data: Match.Optional(Match.OneOf(undefined, null, Object)),
      });

      const widgetId = Widgets.insert({
        type,
        noteId,
        data: data ? data : {}
      });

      const note = Notes.findOne(noteId);
      const newWidgets = R.append(widgetId, note.widgetIds);
      Notes.update(noteId, {
        $set: { widgetIds: newWidgets }
      });
    }
  });

  Meteor.methods({
    'widgets.remove'({noteId, widgetId}) {
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
    'widgets.move'({noteId, widgetId, position}) {
      check(arguments[0], {
        noteId: String,
        widgetId: String,
        position: Number
      });

      const note = Notes.findOne(noteId);
      const indexToRemove = R.findIndex(i => i === widgetId)(note.widgetIds);
      const widgetsLessRemoved = R.remove(indexToRemove, 1, note.widgetIds);
      const newOrderedWidgets = R.insert(position, widgetId, widgetsLessRemoved);

      Notes.update(noteId, {
        $set: { widgetIds: newOrderedWidgets }
      });
    }
  });
}
