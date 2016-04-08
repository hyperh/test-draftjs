import React from 'react';
import Login from './Login.jsx';
import Widget from './widgets/Widget.jsx';
import ListItem from './ListItem.jsx';
import R from 'ramda';
import EditorWidget from './widgets/EditorWidget.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  renderWidgets() {
    const arr = [ 0,1,2,3,4 ];
    const widgets = arr.map(i => (
      <Widget arg={i}>
      </Widget>
    ));

    return R.append(<EditorWidget />, widgets);
  }

  render() {
    const {
      create, select, noteId, remove, login, user, notes, addWidget
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
        <button onClick={addWidget.bind(null, noteId)}>Add widget</button>
        <button onClick={create}>New note</button>

        {notes.map(note =>
          <ListItem select={select} remove={remove} noteId={note._id} />
        )}
      </div>
    );
  }
}
