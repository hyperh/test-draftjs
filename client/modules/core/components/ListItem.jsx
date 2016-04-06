import React from 'react';

export default class ListItem extends React.Component {
  render() {
    const {raw, select, remove, selectedRawId} = this.props;
    return (
      <div>
        <span onClick={select.bind(null, raw._id)}>
          {raw._id}: {raw.blocks.length} blocks
        </span>
        <span><button onClick={remove.bind(null, raw._id)}>Remove</button></span>
        {
          selectedRawId === raw._id ?
          <div>
            {raw.blocks.map(block => (
              <div style={{marginLeft: '10px'}}>{block.key}: {block.text}</div>
            ))}
          </div> : null
        }
      </div>
    );
  }
}
