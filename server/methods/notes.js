import { Meteor } from 'meteor/meteor';
import { Notes } from '/lib/collections';
import { check } from 'meteor/check';

export default function () {
  Meteor.methods({
    'notes.create'() {
      const id = Notes.insert({widgetIds: []});
      return id;
    }
  });

  Meteor.methods({
    'notes.remove'({noteId}) {
      check(arguments[0], {
        noteId: String
      });

      Notes.remove(noteId);
    }
  });
}
