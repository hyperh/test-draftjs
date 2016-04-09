import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isDragging, connectDragSource} = this.props;
    const {widget, removeWidget, noteId} = this.props;
    const {type, _id} = widget;

    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        type: {type}, widgetId: {_id}
        <span><button onClick={removeWidget.bind(this, noteId, _id)}>Remove</button></span>
      </div>
    );
  }
}
Widget.propTypes = {
    // Injected by React DnD from collect function
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

const widgetSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource('widget', widgetSource, collect)(Widget);
