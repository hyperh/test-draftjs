import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';
import {convertFromRaw, ContentState} from 'draft-js';
import R from 'ramda';

const depsMapper = (context, actions) => ({
  context: () => context,
  create: actions.all.create,
  edit: actions.all.edit,
  select: actions.all.select,
  remove: actions.all.remove
});

export const composer = ({context}, onData) => {
  const {Meteor, Collections, LocalState} = context();

  const sub = Meteor.subscribe('all');
  if (sub.ready()) {
    const rawDraftContentStates = Collections.RawDraftContentStates.find({}).fetch();

    const id = LocalState.get('selectedId');
    console.log(`id ${id}`);
    const getContentState = () => {
      if (id) {
        const raw = Collections.RawDraftContentStates.findOne(id);
        const contentBlocks = convertFromRaw(raw);
        const contentState = ContentState.createFromBlockArray(contentBlocks);
        return contentState;
      }
      return undefined;
    };

    onData(null, {
      id,
      contentState: getContentState(),
      rawDraftContentStates
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
