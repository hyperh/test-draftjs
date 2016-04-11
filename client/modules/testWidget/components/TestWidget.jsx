import React, { Component } from 'react';

export default class TestWidget extends Component {
  render() {
    const { widgetId } = this.props;
    return (
      <span>
        widgetId: {widgetId}
      </span>
    );
  }
}
TestWidget.defaultProps = {
  widgetId: '123'
};
