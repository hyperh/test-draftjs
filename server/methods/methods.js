import {Meteor} from 'meteor/meteor';
import {RawDraftContentStates, Locks} from '/lib/collections';
import R from 'ramda';
import {check} from 'meteor/check';

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
    requestAndReleaseLocks({rawId, requestedBlockKeys, releaseBlockKeys, user}) {
      const userId = user._id;
      const username = user.username;

      const locks = Locks.find({ blockKey: { $in: requestedBlockKeys } });
      const noneLocked = locks.length === 0 ? true : false;

      const timeout = 5000;
      const timeDiffs = locks.map(lock => new Date() - lock.updatedAt);
      const canTakeOver = R.filter(diff => diff >= timeout, timeDiffs);
      const canTakeOverAll = canTakeOver.length === timeDiffs.length;

      if (noneLocked || canTakeOverAll) {
        requestedBlockKeys.forEach(blockKey => {
          Locks.upsert({rawId, blockKey},
            { $set: {userId, username, updatedAt: new Date()} }
          );
        });
      }
      Meteor.call('releaseLocks', {rawId, user, blockKeys: releaseBlockKeys});
    }
  });

  Meteor.methods({
    releaseLocks({rawId, blockKeys, user}) {
      const userId = user._id;
      Locks.remove({
        userId,
        rawId,
        blockKey: { $in: blockKeys }
      });
    }
  });

  Meteor.methods({
    releaseAllLocks({user}) {
      if (user) {
        const userId = user._id;
        Locks.remove({ userId });
      }
      else { Locks.remove({}); }

    }
  });

  Meteor.methods({
    releaseOtherLocks({rawId, blockKeys, user}) {
      const userId = user._id;
      Locks.remove({
        userId,
        rawId,
        blockKey: { $nin: blockKeys }
      });
    }
  });

  Meteor.methods({
    editBlock({rawId, user, rawDraftContentState, block}) {
      // console.log(block);

      RawDraftContentStates.update(rawId, rawDraftContentState);
      if (block && block.key) {
        const lock = Locks.findOne({blockKey: block.key, userId: user._id});
        if (lock) {
          Locks.update(lock._id, {
            $set: { updatedAt: new Date() }
          });
        }
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
