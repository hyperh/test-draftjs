import React, { Component } from 'react';

export default class TestWidget extends Component {
  render() {
    const { widget } = this.props;
    const { type, _id: widgetId } = widget;

    return (
      <span>
        type: {type}, widgetId: {widgetId}
      </span>
    );
  }
}
TestWidget.defaultProps = {
  widget: { _id: '123', type: 'default' }
};
