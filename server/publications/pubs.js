import {RawDraftContentStates} from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('all', function () {
    return [
      RawDraftContentStates.find({})
    ];
  });
}
