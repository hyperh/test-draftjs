import React from 'react';

export default class ListItem extends React.Component {
  render() {
    const {raw, select, remove, locked} = this.props;
    return (
      <div>
        <span onClick={select.bind(null, raw._id)}>
          {raw._id}: {raw.blocks.length} blocks, blocks[0]: {raw.blocks[0].text}
        </span>
        <span><button onClick={remove.bind(null, raw._id)}>Remove</button></span>
      </div>
    );
  }
}
