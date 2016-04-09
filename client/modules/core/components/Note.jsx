import React, { Component } from 'react';

import Row from './Row.jsx';
import Widget from './widgets/Widget.jsx';

export default class Note extends Component {
  renderWidgets() {
    const {widgets, removeWidget, noteId} = this.props;
    return widgets.map((widget, index) => {
      return (
        <Row key={widget._id} index={index}>
          <Widget
            widget={widget}
            noteId={noteId}
            removeWidget={removeWidget}
          />
        </Row>
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
