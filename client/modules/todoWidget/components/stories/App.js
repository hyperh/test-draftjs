import React from 'react';
import App from '../App';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('App', module)
  .add('default', () => <App />);
