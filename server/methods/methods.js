import {Meteor} from 'meteor/meteor';
import {Notes, Locks} from '/lib/collections';
import R from 'ramda';
import {check} from 'meteor/check';

export default function () {
  Meteor.methods({
    create() {
      const id = Notes.insert({});
      return id;
    }
  });

  Meteor.methods({
    remove({noteId}) {
      Notes.remove(noteId);
    }
  });

  Meteor.methods({
    '_wipeAndInitialize'() {
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
