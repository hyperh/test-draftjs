import {EditorStates} from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('editorStates', function () {
    return EditorStates.find({});
  });
}
