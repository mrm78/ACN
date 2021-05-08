import React from 'react';
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react';

import App from './CreateCommunity'

describe('App render', () => {
  test('renders', () => {
    render(<App />);
    screen.debug();
  });
});

describe('Snapshot', () => {
  const tree = renderer
  .create(<App />)
  .toJSON();
  expect(tree).toMatchSnapshot();
});
