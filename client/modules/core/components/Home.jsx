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

  handleAddWidget() {
    const { addWidget, noteId } = this.props;
    const type = this.input.value;
    addWidget(noteId, type);
  }

  render() {
    const {
      noteId,
      login,
      createNote, selectNote, removeNote,
      user, notes, widgets,
      removeWidget, moveWidget
    } = this.props;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <button onClick={login.bind(null, 'alice', 1)}>Alice</button>
        <button onClick={login.bind(null, 'bob', 1)}>Bob</button>

        <h1>Note {noteId}</h1>
        {
          noteId ?
          <Note
            noteId={noteId}
            widgets={widgets}
            removeWidget={removeWidget}
            moveWidget={moveWidget}
          /> :
          null
        }

        <button onClick={createNote}>New note</button>
        <span>
          <button onClick={this.handleAddWidget.bind(this)}>Add widget of type</button>
          <input type="text" ref={ref => this.input = ref }/>
        </span>

        {notes.map(note =>
          <ListItem key={note._id} select={selectNote} remove={removeNote} noteId={note._id} />
        )}
      </div>
    );
  }
}
export default DragDropContext(HTML5Backend)(Home);
