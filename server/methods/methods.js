import {Meteor} from 'meteor/meteor';
import {EditorStates} from '/lib/collections';

export default function () {
  Meteor.methods({
    edit({editorState}) {
      EditorStates.insert(editorState);
    }
  });
}
