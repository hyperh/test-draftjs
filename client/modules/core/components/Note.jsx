import React, { Component } from 'react';

import Widget from './widgets/Widget.jsx';
import DraggableWidget from './widgets/DraggableWidget.jsx';

export default class Note extends Component {
  renderWidgets() {
    const {
      noteId,
      widgets,
      removeWidget, moveWidget
    } = this.props;

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
