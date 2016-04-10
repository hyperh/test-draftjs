import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ContentState, ContentBlock, convertToRaw } from 'draft-js';
import { Random } from 'meteor/random';

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
    const indexes = [ 1, 2, 3 ];
    const keyLength = 5;

    const header = new ContentBlock({
      text: 'Meeting Minutes',
      type: 'header-one',
      key: Random.id(keyLength)
    });
    const dateHeader = new ContentBlock({
      text: `Date: ${date.toUTCString()}`,
      type: 'header-three',
    });
    const participantsHeader = new ContentBlock({
      text: 'Participants',
      type: 'header-two',
      key: Random.id(keyLength)
    });
    const participants = indexes.map(index => {
      return new ContentBlock({
        text: `Participant ${index}`,
        type: 'unordered-list-item',
        key: Random.id(keyLength)
      });
    });
    const notesHeader = new ContentBlock({
      text: 'Notes',
      type: 'header-two',
      key: Random.id(keyLength)
    });
    const notes = indexes.map(index => {
      return new ContentBlock({
        text: `Note ${index}`,
        type: 'unordered-list-item',
        key: Random.id(keyLength)
      });
    });
    const actionsHeader = new ContentBlock({
      text: 'Actions',
      type: 'header-two',
      key: Random.id(keyLength)
    });
    const actions = indexes.map(index => {
      return new ContentBlock({
        text: `Action ${index}`,
        type: 'unordered-list-item',
        key: Random.id(keyLength)
      });
    });

    const blockArray = [
      header, dateHeader,
      participantsHeader, ...participants,
      notesHeader, ...notes,
      actionsHeader, ...actions
    ];

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
          <button onClick={this.addMeetingMinutes.bind(this)}>Meeting minutes</button>
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
