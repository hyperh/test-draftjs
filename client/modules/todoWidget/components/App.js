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
        // footer functions
        clearCompleted: () => console.log('actions.clearCompleted() called'),

        // task item functions
        addTask: (text) => console.log(`actions.addTask(text = '${text}') called`),
        removeTask: (id) => console.log(`actions.removeTask(id = ${id}) called`),
        toggleTask: (id) => console.log(`actions.toggleTask(id = ${id}) called`),
        updateTask: (id, text) => console.log(`actions.updateTask(id = ${id}, text = ${text}) called`),

        // task list functions
        toggleAll: () => console.log('actions.toggleAll() called'),
      }
    };
  }

  render() {
    const style = {
      position: 'relative',
      boxSizing: 'border-box',
    };
    const {todos, filter, actions} = this.state;
    return (
      <Paper className='todoapp' style={style}>
        <Header addTask={actions.addTask} />
        <Body todos={todos} actions={actions} />
      </Paper>
    );
  }
}
