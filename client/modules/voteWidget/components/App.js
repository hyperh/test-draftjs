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
    const {widget} = this.props;

    this.defaultState = {
      prompt: 'Type your question here',
      options: [],
    };
    this.state = canSetStateFromProps(widget) ?
      {prompt: widget.data.prompt, options: widget.data.options} :
      this.defaultState;
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
    const {widget} = nextProps;

    if (canSetStateFromProps(widget)) {
      const {prompt, options} = widget.data;
      this.setState({prompt, options});
      return;
    }
    this.setState(this.defaultState);
  }

  updateState(prompt, options) {
    const {widget, update} = this.props;

    this.setState({prompt, options});
    const data = {prompt, options};
    update(widget._id, data);
  }

  render() {
    const style = {
      position: 'relative',
      boxSizing: 'border-box',
      width: '100%',
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

function canSetStateFromProps(widget) {
  const hasData = widget && widget.data;
  const hasPrompt = hasData && widget.data.prompt;
  const hasOptions = hasData && widget.data.options;

  return hasPrompt && hasOptions;
}
