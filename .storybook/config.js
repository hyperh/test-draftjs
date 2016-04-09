import { configure } from '@kadira/storybook';

function loadStories() {
  require('../client/modules/core/components/widgets/stories/button');
  require('../client/modules/todoWidget/components/stories/TodoItem');
  require('../client/modules/todoWidget/components/stories/App');
}

configure(loadStories, module);
