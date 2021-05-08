import React from 'react';
import { render,screen } from '@testing-library/react';
import { useHistory } from "react-router-dom";
 
import Home from './HomePage';
 
describe('App', () => {
  test('renders App component', () => {
    const tree =render(<Home />);
    expect(screen.getByTestId("tab0")).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});