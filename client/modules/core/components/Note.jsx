import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import Widget from './widgets/Widget.jsx';

export default class Note extends Component {
  renderWidgets() {
    const {widgets, removeWidget, noteId} = this.props;
    return widgets.map(widget => {
      return (
        <Widget
          key={widget._id}
          widget={widget}
          noteId={noteId}
          removeWidget={removeWidget}
        />
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
