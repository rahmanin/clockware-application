import {Button} from "../index"
import React from 'react';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

test('Render Button', () => {
  const component = render(
    <Button title={"Aaa"} disabled={false} color={"black"}/>,
  );
  expect(component.baseElement).toMatchSnapshot();
  
});