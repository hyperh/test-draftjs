import React, { Component } from 'react';

import Widgets from './widgets';

export default class Note extends Component {
  renderWidgets() {
    const {
      noteId,
      widgets,
      removeWidget, moveWidget
    } = this.props;

    const DraggableWidget = Widgets['draggable'];
    const Widget = Widgets['widget'];

    return widgets.map((widget, index) => {
      return (
        <DraggableWidget
          key={widget._id}
          index={index}
          noteId={noteId}
          widgetId={widget._id}
          moveWidget={moveWidget}
        >
          <Widget widget={widget} removeWidget={removeWidget} />
        </DraggableWidget>
      );
    });
  }

  render() {
    return (
      <div className="editor">
        {this.renderWidgets()}
      </div>
    );
  }
}
