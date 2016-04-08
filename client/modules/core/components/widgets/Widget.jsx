import React from 'react';

export default class Widget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type, widgetId, removeWidget, noteId} = this.props;
    return (
      <div>
        type: {type}, widgetId: {widgetId}
        <span><button onClick={removeWidget.bind(this, noteId, widgetId)}>Remove</button></span>
      </div>
    );
  }
}
