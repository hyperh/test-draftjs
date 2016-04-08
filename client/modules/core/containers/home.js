import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';

const depsMapper = (context, actions) => ({
  context: () => context,
  create: actions.notes.create,
  select: actions.notes.select,
  remove: actions.notes.remove,
  login: actions.notes.login,
  addWidget: actions.notes.addWidget
});

export const composer = ({context}, onData) => {
  const {Meteor, Collections, LocalState} = context();

  const sub = Meteor.subscribe('all');
  if (sub.ready()) {
    const noteId = LocalState.get('noteId');
    const user = LocalState.get('fakeUser');
    const notes = Collections.Notes.find({}).fetch();
    const widgets = Collections.Widgets.find({noteId}).fetch();

    onData(null, {
      noteId,
      user,
      notes,
      widgets
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
