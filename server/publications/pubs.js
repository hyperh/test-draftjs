import {Blocks} from '/lib/collections';
import {Meteor} from 'meteor/meteor';

export default function () {
  Meteor.publish('blocks', function () {
    return Blocks.find({});
  });
}
