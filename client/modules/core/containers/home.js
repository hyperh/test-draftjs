import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import Home from '../components/Home.jsx';
import {convertFromRaw, ContentState} from 'draft-js';
import R from 'ramda';

const depsMapper = (context, actions) => ({
  context: () => context,
  create: actions.all.create,
  edit: actions.all.edit,
  select: actions.all.select,
  remove: actions.all.remove,
  lock: actions.all.lock,
  unlock: actions.all.unlock,
  login: actions.all.login
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
    const getSelectedLock = () => {
      if (rawId) {
        const lock = Collections.Locks.findOne({rawId});
        return lock;
      }
      return undefined;
    };

    onData(null, {
      rawId,
      contentState: getContentState(),
      rawDraftContentStates,
      user: LocalState.get('fakeUser'), // Meteor.user(),
      selectedLock: getSelectedLock()
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
