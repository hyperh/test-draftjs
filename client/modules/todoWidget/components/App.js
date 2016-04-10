import React from 'react';

import Paper from 'material-ui/lib/paper';

import Header from './Header';
import Body from './Body';
import './app.css';
import './placeholder.css';

import {addTask, removeTask, toggleTask,
  updateTask, toggleAll, clearCompleted} from '../actions/actions';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: []};
  }

  getActions() {
    return {
      addTask: addTask.bind(this),
      removeTask: removeTask.bind(this),
      toggleTask: toggleTask.bind(this),
      updateTask: updateTask.bind(this),
      toggleAll: toggleAll.bind(this),
      clearCompleted: clearCompleted.bind(this),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.todos) {
      this.setState({todos: nextProps.todos});
    }
  }

  updateState(todos) {
    this.setState({todos});
    // this.props.updateServer(todos);   // a function passed in by props
  }

  render() {
    const style = {
      position: 'relative',
      boxSizing: 'border-box',
    };
    const {todos} = this.state;
    const actions = this.getActions();
    return (
      <Paper className='todoapp' style={style}>
        <Header addTask={actions.addTask} />
        <Body todos={todos} actions={actions} />
      </Paper>
    );
  }
}
