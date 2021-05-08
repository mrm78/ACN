import React from 'react';
import { render,screen } from '@testing-library/react';
import { useHistory } from "react-router-dom";
import Home from './HomePage';
import {createMemoryHistory} from 'history';
import {Router} from 'react-router';

 
describe('App', () => {
  test('renders App component', () => {
    const history = createMemoryHistory();
    const tree =render(<Router history={history}><Home /></Router>);
    expect(screen.getByTestId("tab0")).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});