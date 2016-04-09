import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import { ContentState, convertToRaw } from 'draft-js';

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

  addMeetingMinutes() {
    const { addWidget, noteId } = this.props;
    const type = 'editor';

    const date = new Date();
    const blockArray = DraftPasteProcessor.processHTML(
      `
        <h1>Meeting Minutes</h1>

        <h2>Date: ${date.toUTCString()}</h2>

        <h3>Participants</h3>
        <ul>
          <li>Person 1</li>
          <li>Person 2</li>
          <li>Person 3</li>
        </ul>

        <h3>Notes</h3>
        <ul>
          <li>Note 1</li>
          <li>Note 2</li>
          <li>Note 3</li>
        </ul>

        <h3>Actions</h3>
        <ul>
          <li>Action 1</li>
          <li>Action 2</li>
          <li>Action 3</li>
        </ul>
      `
    );
    const contentState = ContentState.createFromBlockArray(blockArray);
    const raw = convertToRaw(contentState);
    addWidget(noteId, type, raw);
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
          <button onClick={this.addMeetingMinutes.bind(this)}>Meeting minutes</button>
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
