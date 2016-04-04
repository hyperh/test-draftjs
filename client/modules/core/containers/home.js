import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';
import {convertFromRaw} from 'draft-js';
import R from 'ramda';

const depsMapper = (context, actions) => ({
  context: () => context,
  edit: actions.all.edit
});

export const composer = ({context}, onData) => {
  const {Meteor, FlowRouter, Collections} = context();
  const sub = Meteor.subscribe('all');
  if (sub.ready()) {
    const rawDraftContentStates = Collections.RawDraftContentStates.find({}).fetch();
    const contentState = convertFromRaw(R.last(rawDraftContentStates));

    onData(null, {contentState});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
