import React, { Component } from 'react';
import Widgets from '/client/modules/core/components/widgets';

export default class Widget extends Component {
  render() {
    const { widget, removeWidget, update } = this.props;
    const { _id: widgetId, noteId, type } = widget;

    const WidgetType = Widgets[type];
    return (
      <span>
        <WidgetType
          widgetId={widget._id}
          noteId={widget.noteId}
          data={widget.data}
          update={update}
        />
        <span>
          <button onClick={removeWidget.bind(this, noteId, widgetId)}>Remove</button>
        </span>
      </span>
    );
  }
}
