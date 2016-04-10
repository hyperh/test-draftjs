import {useDeps, composeAll} from 'mantra-core';
import EditorWidget from '../components/EditorWidget.jsx';

const depsMapper = (context, actions) => ({
  context: () => context,
  update: actions.widgets.update
});

export default composeAll(
  useDeps(depsMapper)
)(EditorWidget);
