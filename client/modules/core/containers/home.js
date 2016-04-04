import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';

const depsMapper = (context, actions) => ({
  context: () => context,
  edit: actions.all.edit
});

export const composer = ({context}, onData) => {
  const {Meteor, FlowRouter, Collections} = context();
  const sub = Meteor.subscribe('editorStates');
  if (sub.ready()) {
    const editorStates = Collections.EditorStates.find({}).fetch();
    onData(null, {editorStates});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
