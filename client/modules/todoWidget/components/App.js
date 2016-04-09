import React from 'react';

import Paper from 'material-ui/lib/paper';

import Header from './Header';
import Body from './Body';
// import './app.css';
// import './placeholder.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: []};
  }

  getActions() {
    return {
      addTask: this.addTask.bind(this),
      removeTask: this.removeTask.bind(this),
      toggleTask: this.toggleTask.bind(this),
      updateTask: this.updateTask.bind(this),
      toggleAll: this.toggleAll.bind(this),
      clearCompleted: this.clearCompleted.bind(this),
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

  addTask(text) {
    const {todos} = this.state;
    const randomNum = Math.random();
    const newTodo = {
      id: 'id_' + randomNum,
      text,
      completed: false,
    };
    const newTodos = todos.concat(newTodo);
    this.updateState(newTodos);
  }

  removeTask(id) {
    const {todos} = this.state;
    const newTodos = todos.filter(todo => todo.id !== id);
    this.updateState(newTodos);
  }

  toggleTask(id) {
    const {todos} = this.state;
    const newTodos = todos.map(todo => {
      return todo.id === id ? Object.assign(todo, {completed: !todo.completed}) : todo;
    });
    this.updateState(newTodos);
  }

  updateTask(id, text) {
    const {todos} = this.state;
    const newTodos = todos.map(todo => {
      return todo.id === id ? Object.assign(todo, {text}) : todo;
    });
    this.updateState(newTodos);
  }

  clearCompleted() {
    const {todos} = this.state;
    const newTodos = todos.filter(todo => !todo.completed);
    this.updateState(newTodos);
  }

  toggleAll() {
    const {todos} = this.state;
    const isAllChecked = todos.length === todos.filter(todo => todo.completed).length;
    let newTodos = todos.map(todo => Object.assign(todo, {completed: !isAllChecked}));
    this.updateState(newTodos);
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
