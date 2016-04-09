import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';
import { ItemTypes } from '/lib/constants';

const widgetSource = {
  beginDrag(props) {
    return {
      widgetId: props.widget._id,
      index: props.index
    };
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const widgetTarget = {
  hover(props, monitor, component) {
    const { widgetId, index: dragIndex } = monitor.getItem();
    const { index: hoverIndex, moveWidget, noteId } = props;

    if (dragIndex === hoverIndex) { return; }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return; }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return; }

    const throttledMove = _.throttle(() => {
      // Time to actually perform the action
      moveWidget(noteId, widgetId, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }, 500);
    throttledMove();
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const { widget, removeWidget, noteId } = this.props;
    const { type, _id } = widget;

    return connectDragSource(connectDropTarget(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        type: {type}, widgetId: {_id}
        <span><button onClick={removeWidget.bind(this, noteId, _id)}>Remove</button></span>
      </div>
    ));
  }
}
Widget.propTypes = {
    // Injected by React DnD from collect function
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default _.flow(
  DragSource(ItemTypes.WIDGET, widgetSource, collectSource),
  DropTarget(ItemTypes.WIDGET, widgetTarget, collectTarget)
)(Widget);
