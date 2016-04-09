import React, { Component } from 'react';
import WidgetTypes from '/client/lib/widgetTypes';

export default class Widget extends Component {
  render() {
    const { widget, removeWidget } = this.props;
    const { _id: widgetId, noteId, type } = widget;

    return (
      <span>
        { WidgetTypes[type](widget) }
        <span>
          <button onClick={removeWidget.bind(this, noteId, widgetId)}>Remove</button>
        </span>
      </span>
    );
  }
}
