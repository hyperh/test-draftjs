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
  requestLock: actions.all.requestLock,
  releaseLock: actions.all.releaseLock,
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
    const user = LocalState.get('fakeUser');

    const getCanEdit = () => {
      if (rawId) {
        const lock = Collections.Locks.findOne({rawId});
        if (lock && user) { return lock.userId === user._id; }
        return false;
      }
      return false;
    };

    const getLock = () => {
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
      user,
      canEdit: getCanEdit(),
      lock: getLock()
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home);
