import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Login from './Login.jsx';
import ListItem from './ListItem.jsx';
import Note from './Note.jsx';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      create, select, noteId, remove, login, user, notes, addWidget, widgets, removeWidget
    } = this.props;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <button onClick={login.bind(null, 'alice', 1)}>Alice</button>
        <button onClick={login.bind(null, 'bob', 1)}>Bob</button>

        <h1>Note {noteId}</h1>
        {noteId ? <Note noteId={noteId} widgets={widgets} removeWidget={removeWidget} /> : null}

        <button onClick={addWidget.bind(null, noteId)}>Add widget</button>
        <button onClick={create}>New note</button>

        {notes.map(note =>
          <ListItem key={note._id} select={select} remove={remove} noteId={note._id} />
        )}
      </div>
    );
  }
}
export default DragDropContext(HTML5Backend)(Home);
