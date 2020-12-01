import {Content} from "../index"
import React from 'react';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

test('Render', () => {
  const component = render(
    <Content children/>,
  );
  expect(component.baseElement).toMatchSnapshot();
  
});