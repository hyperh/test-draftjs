import React, { Component } from 'react';
import { ItemTypes } from '/lib/constants';
import { DropTarget } from 'react-dnd';

const rowTarget = {
  drop(props) {
    const {index, moveWidget} = this.props;
    moveWidget(noteId, widgetId, index);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Row extends Component {
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.WIDGET, rowTarget, collect)(Row);
