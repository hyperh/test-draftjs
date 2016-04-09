import React, { Component } from 'react';

export default class DragHandle extends Component {
  render() {
    const handleStyle = {
      backgroundColor: 'green',
      width: '1rem',
      height: '1rem',
      display: 'inline-block',
      marginRight: '0.75rem',
      cursor: 'move'
    };

    return (
      <div style={handleStyle} />
    );
  }
}
