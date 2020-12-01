import {Loader} from "../index"
import React from 'react';
import {cleanup} from '@testing-library/react';
import { act } from "react-dom/test-utils";
import {shallow} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

act(() => {
  it('Render Loader', () => {
    const component = shallow(
        <Loader />
    );
    expect(component).toMatchSnapshot();
  });
})
