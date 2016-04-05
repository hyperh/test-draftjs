import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates, Locks} from '/lib/collections';

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

  Meteor.methods({
    remove({id}) {
      RawDraftContentStates.remove(id);
    }
  });

  Meteor.methods({
    lock({id}) {
      const userId = this.userId;
      const locks = Locks.find({id});
      const locked = locks.count() > 1;

      if (!locked) { Locks.insert({id, userId}); }
    }
  });

  Meteor.methods({
    unlock({id}) {
      const userId = this.userId;
      Locks.remove({id, userId});
    }
  });

  Meteor.methods({
    '_wipeAndInitialize'() {
      RawDraftContentStates.remove({});
      Locks.remove({});
      Meteor.users.remove({});

      Accounts.createUser({
        email: 'alic@test.com',
        username: 'alice',
        password: '1'
      });

      Accounts.createUser({
        email: 'bob@test.com',
        username: 'bob',
        password: '1'
      });
    }
  });
}
