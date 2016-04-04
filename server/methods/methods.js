import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates} from '/lib/collections';

export default function () {
  Meteor.methods({
    create({rawDraftContentState}) {
      const id = RawDraftContentStates.insert(rawDraftContentState);
      return id;
    }
  });

  Meteor.methods({
    edit({id, rawDraftContentState}) {
      RawDraftContentStates.update(id, rawDraftContentState);
    }
  });
}
