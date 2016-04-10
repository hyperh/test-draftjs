import React from 'react';

import OptionEditInput from './OptionEditInput';
import OptionItemButtons from './OptionItemButtons';

import {getPercentage} from '../utils/voting';

export default class OptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      editing: false,
    };
    this.handleMouseOver = () => this.setState({hovered: true});
    this.handleMouseOut = () => this.setState({hovered: false});
    this.startEditing = () => this.setState({editing: true});
    this.stopEditing = () => this.setState({editing: false});
  }

  renderBtns() {
    const {user, option, voted, actions} = this.props;
    return (
      <OptionItemButtons
        user={user}
        option={option}
        voted={voted}
        actions={actions}
      />
    );
  }

  renderEditing() {
    const {updateOptionLabel} = this.props.actions;
    return (
      <OptionEditInput
        option={this.props.option}
        stopEditing={this.stopEditing}
        updateOptionLabel={updateOptionLabel}
      />
    );
  }

  render() {
    const {option, totalVotes, voted} = this.props;
    const styles = getStyles();

    const votes = option.voters.length;
    const percentage = getPercentage(option.voters.length, totalVotes);
    const barStyle = Object.assign({width: percentage}, getStyles().bar);

    const renderNumbers = () => <div style={styles.numbers}>{votes} / {percentage}</div>;
    const renderLabel = () => {
      const labelStyle = voted ?
        Object.assign(styles.label, {color: styles.labelAccent}) : styles.label;
      return (
        <div style={labelStyle} onDoubleClick={this.startEditing}>
          {option.label}
        </div>
      );
    };

    return (
      <div
        style={styles.container}
        onMouseEnter={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}
      >
        <div style={barStyle} />
        { this.state.editing ? this.renderEditing() : renderLabel() }
        { this.state.hovered ? this.renderBtns() : renderNumbers() }
      </div>
    );
  }
}

function getStyles() {
  return {
    container: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #ededed',
      boxSizing: 'border-box',
      padding: '15px',
      fontSize: '16px',
    },
    label: {
      zIndex: '2',
    },
    labelAccent: '#ff4081',
    numbers: {
      display: 'flex',
      zIndex: '2',
      color: '#999',
    },
    bar: {
      position: 'absolute',
      height: '100%',
      // backgroundColor: '#46CFE0',
      backgroundColor: 'rgba(70, 207, 224, 0.2)',
      top: '0',
      left: '0',
      bottom: '0',
      zIndex: '1',
      transition: 'all 1s',
    },
  };
}
