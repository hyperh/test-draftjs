import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('all', function () {
    return [
      Collections.RawDraftContentStates.find({}),
      Collections.Locks.find({})
    ];
  });
}
