import {EditorStates, RawDraftContentStates} from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('all', function () {
    return [
      EditorStates.find({}),
      RawDraftContentStates.find({})
    ];
  });
}
