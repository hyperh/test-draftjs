import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';
import {convertFromRaw, ContentState} from 'draft-js';
import R from 'ramda';

const depsMapper = (context, actions) => ({
  context: () => context,
  create: actions.notes.create,
  select: actions.notes.select,
  remove: actions.notes.remove,
  login: actions.notes.login,
  takeOver: actions.notes.takeOver,
  requestLocks: actions.notes.requestLocks,
  requestAndReleaseLocks: actions.notes.requestAndReleaseLocks,
  releaseAllLocks: actions.notes.releaseAllLocks,
  releaseOtherLocks: actions.notes.releaseOtherLocks,
  editBlock: actions.notes.editBlock
});

export const composer = ({context}, onData) => {
  const {Meteor, Collections, LocalState} = context();

  const sub = Meteor.subscribe('all');
  if (sub.ready()) {
    const rawDraftContentStates = Collections.RawDraftContentStates.find({}).fetch();
    const rawId = LocalState.get('selectedId');
    const getContentState = () => {
      if (rawId) {
        const raw = Collections.RawDraftContentStates.findOne(rawId);
        const contentBlocks = convertFromRaw(raw);
        const contentState = ContentState.createFromBlockArray(contentBlocks);
        return contentState;
      }
      return undefined;
    };
    const user = LocalState.get('fakeUser');

    onData(null, {
      rawId,
      contentState: getContentState(),
      rawDraftContentStates,
      user,
      locks: Collections.Locks.find().fetch()
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
