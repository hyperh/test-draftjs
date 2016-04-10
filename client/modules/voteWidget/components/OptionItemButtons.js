import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import VoteIcon from 'material-ui/lib/svg-icons/action/thumb-up';
import RemoveIcon from 'material-ui/lib/svg-icons/navigation/close';

export default class OptionItemButtons extends React.Component {

  handleCancelVote() {
    const {user, option, actions} = this.props;
    actions.cancelVote(user, option.id);
  }

  handleCreateVote() {
    const {user, option, actions} = this.props;
    actions.createVote(user, option.id);
  }

  handleRemoveOption() {
    const {option, actions} = this.props;
    actions.removeOption(option.id);
  }

  render() {
    const {voted} = this.props;

    const styles = getStyles();
    const {base, accent} = styles.iconColors;

    return (
      <div style={styles.buttons}>

        <IconButton
          tooltip={voted ? 'Cancel Vote' : 'Vote'}
          onClick={voted ? this.handleCancelVote.bind(this) : this.handleCreateVote.bind(this)}
          style={styles.buttonStyle}
        >
          <VoteIcon color={voted ? accent : base}/>
        </IconButton>

        <IconButton
          tooltip="Remove Option"
          onClick={this.handleRemoveOption.bind(this)}
          style={styles.buttonStyle}
        >
          <RemoveIcon color={base}/>
        </IconButton>

      </div>
    );
  }
}

function getStyles() {
  return {
    buttons: {
      display: 'flex',
      zIndex: '2',
      margin: '-14px -15px -15px',
    },
    buttonStyle: {
      marginRight: '4px',
    },
    iconColors: {
      base: '#999',
      accent: '#ff4081',
    },
  };
}
