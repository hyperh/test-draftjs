import { Meteor } from 'meteor/meteor';
import { Notes, Locks, Widgets } from '/lib/collections';
import { check } from 'meteor/check';

export default function () {
  Meteor.methods({
    '_wipeAndInitialize'() {
      Locks.remove({});
      Widgets.remove({});
      Notes.remove({});
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
