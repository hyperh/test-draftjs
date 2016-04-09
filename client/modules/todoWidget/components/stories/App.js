import React from 'react';
import App from '../App';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Todo App', module)
  .add('default', () => <App />);
