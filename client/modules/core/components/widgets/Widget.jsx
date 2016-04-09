import React from 'react';
import { DragSource } from 'react-dnd';

export default class Widget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isDragging, connectDragSource} = this.props;
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
// Widget.propTypes = {
//     // Injected by React DnD from collect function
//   connectDragSource: React.PropTypes.func.isRequired,
//   isDragging: React.PropTypes.bool.isRequired
// };

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

// export default DragSource('widget', widgetSource, collect)(Widget);
