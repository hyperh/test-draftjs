import React from 'react';

export default class Widget extends React.Component {
  render() {
    const {type, widgetId} = this.props;
    return (
      <div>
        type: {type}, widgetId: {widgetId}
      </div>
    );
  }
}
