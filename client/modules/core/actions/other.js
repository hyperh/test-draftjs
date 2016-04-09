export default {
  login({Meteor, LocalState, FlowRouter}, usernameOrEmail, password) {
    // Meteor.loginWithPassword(usernameOrEmail, password, (err) => {
    //   if (err) { alert(err); }
    // });
    if (usernameOrEmail === 'alice') {
      LocalState.set('fakeUser', {
        _id: 0,
        username: usernameOrEmail
      });
    }
    else if (usernameOrEmail === 'bob') {
      LocalState.set('fakeUser', {
        _id: 1,
        username: usernameOrEmail
      });
    }
  }
};
