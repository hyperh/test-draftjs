import { configure } from '@kadira/storybook';

function loadStories() {
  require('../client/modules/todoWidget/components/stories/App');
}

configure(loadStories, module);
