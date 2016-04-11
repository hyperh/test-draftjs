import React from 'react';
import R from 'ramda';

import Paper from 'material-ui/lib/paper';

import Header from './Header';
import Body from './Body';
// import './app.css';
// import './placeholder.css';

import {addTask, removeTask, toggleTask,
  updateTask, toggleAll, clearCompleted} from '../actions/actions';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const {widget} = props;
    this.state = {
      todos: canSetStateFromProps(widget) ?
        widget.data.todos :
        []
    };
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
    const {widget} = nextProps;
    if (canSetStateFromProps(widget)) {
      this.setState({todos: widget.data.todos});
    }
  }

  updateState(todos) {
    const {widget, update} = this.props;

    this.setState({todos});
    update(widget._id, {todos});
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

function canSetStateFromProps(widget) {
  const hasData = widget && widget.data;
  const hasTodos = hasData && !R.isEmpty(widget.data.todos);
  return hasTodos;
}
