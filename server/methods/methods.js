import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates, Locks} from '/lib/collections';

export default function () {
  Meteor.methods({
    create({rawDraftContentState}) {
      const rawId = RawDraftContentStates.insert(rawDraftContentState);
      return rawId;
    }
  });

  Meteor.methods({
    edit({rawId, rawDraftContentState, user}) {
      RawDraftContentStates.update(rawId, rawDraftContentState);
      const lock = Locks.findOne({rawId, userId: user._id});
      if (lock) {
        lock.update(lock._id, { $set: { updatedAt: new Date() } });
      }
    }
  });

  Meteor.methods({
    remove({rawId}) {
      RawDraftContentStates.remove(rawId);
    }
  });

  Meteor.methods({
    requestLock({rawId, user}) {
      // const userId = this.userId;
      const userId = user._id;
      const lock = Locks.findOne({rawId});
      const locked = lock ? true : false;

      // const user = Meteor.users.findOne(userId);
      const username = user.username;

      if (!locked || new Date() - lock.updatedAt > 5000) {
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
    takeLock({rawId, user}) {
      const userId = user._id;
      const lock = Locks.findOne({rawId});

      if (new Date() - lock.updatedAt > 5000) {
        Locks.remove({rawId});
        Locks.insert({rawId, userId});
      }
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
