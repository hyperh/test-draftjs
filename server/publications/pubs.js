import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('all', function () {
    return [
      Collections.Notes.find({}),
      Collections.Locks.find({}),
      Collections.Widgets.find({})
    ];
  });
}
