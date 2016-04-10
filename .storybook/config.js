import { configure } from '@kadira/storybook';

function loadStories() {
  require('../client/modules/todoWidget/components/stories/App');
  require('../client/modules/voteWidget/components/stories/App');
}

configure(loadStories, module);
