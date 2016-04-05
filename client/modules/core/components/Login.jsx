import React from 'react';

export default class Login extends React.Component {
  handleSubmit() {
    const usernameOrEmail = this.usernameOrEmail.value;
    const password = this.password.value;

    const {login} = this.props;
    login(usernameOrEmail, password);
  }

  render() {
    const {user} = this.props;
    return (
      <div>
        <input
          ref={ref => this.usernameOrEmail = ref}
          placeholder="username or email"
        />
        <input
          type="password"
          ref={ref => this.password = ref}
          placeholder="password"
        />
        <button onClick={this.handleSubmit.bind(this)}>Login</button>
        <div>
          {user ? `Logged in as: ${user.username}` : null}
        </div>
      </div>
    );
  }
}
