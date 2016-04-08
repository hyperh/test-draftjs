import React from 'react';

export default class Widget extends React.Component {
  render() {
    const {arg} = this.props;
    return (
      <div>
        A widget. Arg is {arg}
      </div>
    );
  }
}
