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
    requestLock({rawId, user}) {
      // const userId = this.userId;
      const userId = user._id;
      const locks = Locks.find({rawId});
      const locked = locks.count() > 0;

      // const user = Meteor.users.findOne(userId);
      const username = user.username;

      if (!locked) {
        Locks.insert({rawId, userId, username});
      }
    }
  });

  Meteor.methods({
    releaseLock({rawId, user}) {
      // const userId = this.userId;
      const userId = user._id;
      Locks.remove({rawId, userId});
    }
  });

  Meteor.methods({
    '_wipeAndInitialize'() {
      RawDraftContentStates.remove({});
      Locks.remove({});
      Meteor.users.remove({});

      Accounts.createUser({
        email: 'alice@test.com',
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
