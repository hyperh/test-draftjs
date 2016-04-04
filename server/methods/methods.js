import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates} from '/lib/collections';

export default function () {
  Meteor.methods({
    edit({rawDraftContentState}) {
      RawDraftContentStates.insert(rawDraftContentState);
    }
  });
}
