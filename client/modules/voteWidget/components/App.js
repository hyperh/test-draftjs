import React from 'react';

import Paper from 'material-ui/lib/paper';

// import './app.css';
// import './placeholder.css';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';

import {updatePrompt, createOption, updateOptionLabel,
  removeOption, cancelVote, createVote} from '../actions/actions';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      prompt: 'Type your question here',
      options: [],
    };
    this.state = this.defaultState;
  }

  getActions() {
    return {
      updatePrompt: updatePrompt.bind(this),
      createOption: createOption.bind(this),
      updateOptionLabel: updateOptionLabel.bind(this),
      removeOption: removeOption.bind(this),
      cancelVote: cancelVote.bind(this),
      createVote: createVote.bind(this),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      const {prompt, options} = nextProps.data;
      this.setState({prompt, options});
      return;
    }
    this.setState(this.defaultState);
  }

  updateState(prompt, options) {
    this.setState({prompt, options});
    const data = {prompt, options};
    // this.props.updateServer(data);   // a function passed in by props
  }

  render() {
    const style = {
      position: 'relative',
      boxSizing: 'border-box',
    };
    const {prompt, options} = this.state;
    const actions = this.getActions();
    const user = 'userOne';   // hardcoded user for testing purposes, replace with real userId
    return (
      <Paper className='voteapp' style={style}>
        <Header prompt={prompt} updatePrompt={actions.updatePrompt}/>
        <Body user={user} options={options} actions={actions} />
        { options.length ? <Footer user={user} options={options} /> : null }
      </Paper>
    );
  }
}
