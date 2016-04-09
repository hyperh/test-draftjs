import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';
import R from 'ramda';

const depsMapper = (context, actions) => ({
  context: () => context,
  createNote: actions.notes.create,
  selectNote: actions.notes.select,
  removeNote: actions.notes.remove,
  login: actions.other.login,
  addWidget: actions.widgets.add,
  removeWidget: actions.widgets.remove,
  moveWidget: actions.widgets.move
});

export const composer = ({context}, onData) => {
  const {Meteor, Collections, LocalState} = context();

  const sub = Meteor.subscribe('all');
  if (sub.ready()) {
    const noteId = LocalState.get('noteId');
    const user = LocalState.get('fakeUser');
    const notes = Collections.Notes.find({}).fetch();

    const getWidgets = () => {
      if (noteId) {
        const note = Collections.Notes.findOne(noteId);
        const widgets = Collections.Widgets.find({noteId}).fetch();
        const widgetOrder = note.widgetIds;

        if (!R.isEmpty(widgets)) {
          const groupById = R.groupBy(R.prop('_id'), widgets);
          const sortById = R.map(id => groupById[id][0]);
          return sortById(widgetOrder);
        }
        return [];
      }
      return [];
    };


    onData(null, {
      noteId,
      user,
      notes,
      widgets: getWidgets()
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
