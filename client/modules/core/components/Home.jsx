import React from 'react';
import Login from './Login.jsx';
import Widget from './Widget.jsx';
import ListItem from './ListItem.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: undefined,
      releaseLockOnBlur: true,
      isEditing: false
    };
  }

  renderWidgets() {
    const arr = [ 1,2,3,4,5 ];
    return arr.map(i => <Widget arg={i} />);
  }

  render() {
    const {
      create, select, noteId, remove, login, user, notes
    } = this.props;

    return (
      <div id="main-page">
        <Login login={login} user={user} />
        <button onClick={login.bind(null, 'alice', 1)}>Alice</button>
        <button onClick={login.bind(null, 'bob', 1)}>Bob</button>

        <h1>Note {noteId}</h1>

        {
          noteId ?
            <div className="editor">
              {this.renderWidgets()}
            </div> : null
        }

        <button onClick={create}>New note</button>

        {notes.map(note => <ListItem select={select} remove={remove} noteId={note._id} />)}
      </div>
    );
  }
}
