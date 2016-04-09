import React from 'react';

import Paper from 'material-ui/lib/paper';

import Header from './Header';
import Body from './Body';
import './app.css';
import './placeholder.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        {
          id: 'id_one',
          text: 'Make cool website',
          completed: true,
        },
        {
          id: 'id_two',
          text: 'Buy awesome widgets',
          completed: false,
        },
      ],
      actions: {
        addTask: this.addTask.bind(this),
        removeTask: this.removeTask.bind(this),
        toggleTask: this.toggleTask.bind(this),
        updateTask: this.updateTask.bind(this),
        toggleAll: this.toggleAll.bind(this),
        clearCompleted: this.clearCompleted.bind(this),
      }
    };
  }

  updateState(todos) {
    this.setState({todos});
    console.log('Update server with the new list of todos:');
    console.log(todos);
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
      if (todo.id === id) {
        return Object.assign(todo, {completed: !todo.completed});
      }
      return todo;
    });
    this.updateState(newTodos);
  }

  updateTask(id, text) {
    const {todos} = this.state;
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return Object.assign(todo, {text});
      }
      return todo;
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
    const {todos, actions} = this.state;
    return (
      <Paper className='todoapp' style={style}>
        <Header addTask={actions.addTask} />
        <Body todos={todos} actions={actions} />
      </Paper>
    );
  }
}
