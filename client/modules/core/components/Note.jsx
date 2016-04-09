import React, { Component } from 'react';

import Widget from './widgets/Widget.jsx';

export default class Note extends Component {
  renderWidgets() {
    const {
      noteId,
      widgets,
      removeWidget, moveWidget
    } = this.props;

    return widgets.map((widget, index) => {
      return (
        <Widget
          key={widget._id}
          index={index}
          widget={widget}
          noteId={noteId}
          removeWidget={removeWidget}
          moveWidget={moveWidget}
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
