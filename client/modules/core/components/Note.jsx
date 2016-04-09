import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Widget from './widgets/Widget.jsx';

class Note extends Component {
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
export default DragDropContext(HTML5Backend)(Note);
