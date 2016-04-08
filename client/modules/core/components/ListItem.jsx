import React from 'react';

export default class ListItem extends React.Component {
  render() {
    const {select, remove, noteId} = this.props;
    return (
      <div>
        <span onClick={select.bind(null, noteId)}>{noteId}</span>
        <span><button onClick={remove.bind(null, noteId)}>Remove</button></span>
      </div>
    );
  }
}
