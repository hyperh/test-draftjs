import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates, Locks} from '/lib/collections';
import R from 'ramda';

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
        Locks.update(lock._id, { $set: { updatedAt: new Date() } });
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

      const timeout = 5000;
      const timeDiff = lock ? new Date() - lock.updatedAt : timeout + 1;

      // const user = Meteor.users.findOne(userId);
      const username = user.username;

      if (!locked || timeDiff >= timeout) {
        Locks.upsert({rawId},
          { $set: {userId, username, updatedAt: new Date()} }
        );
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
    requestBlockLock({blockKey, user}) {
      const userId = user._id;
      const lock = Locks.findOne({blockKey});
      const locked = lock ? true : false;

      const timeout = 5000;
      const timeDiff = lock ? new Date() - lock.updatedAt : timeout + 1;
      const username = user.username;

      if (!locked || timeDiff >= timeout) {
        Locks.upsert({blockKey},
          { $set: {userId, username, updatedAt: new Date()} }
        );
      }
      Meteor.call('releaseOtherBlockLocks', {user, blockKey});
    }
  });

  Meteor.methods({
    editBlock({rawId, user, rawDraftContentState, block}) {
      console.log(block);

      RawDraftContentStates.update(rawId, rawDraftContentState);
      const lock = Locks.findOne({blockKey: block.key, userId: user._id});
      if (lock) {
        Locks.update(lock._id, { $set: { updatedAt: new Date() } });
      }

    }
  });

  Meteor.methods({
    releaseBlockLocks({user}) {
      const userId = user._id;
      Locks.remove({userId});
    }
  });

  Meteor.methods({
    releaseOtherBlockLocks({user, blockKey}) {
      const userId = user._id;
      Locks.remove({userId, blockKey: {$ne: blockKey}});
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
