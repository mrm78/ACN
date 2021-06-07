import React from 'react';
import { render,screen } from '@testing-library/react';
import { useHistory } from "react-router-dom";
 
import Community from "./CommunityView";
 
describe('App', () => {
  test('renders App component', () => {
    const tree2 =render(<Community match={{params:{comId:"2"}}} />);
    // expect(screen.getByTestId("tab0")).toBeTruthy();
    expect(tree2).toMatchSnapshot();
  });
});