import React from 'react';

export default class Widget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {widget, removeWidget, noteId} = this.props;
    const {type, _id} = widget;

    return (
      <div>
        type: {type}, widgetId: {_id}
        <span><button onClick={removeWidget.bind(this, noteId, _id)}>Remove</button></span>
      </div>
    );
  }
}
