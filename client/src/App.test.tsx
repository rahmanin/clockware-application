import React from 'react';
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "./store/reducer";
import { act } from "react-dom/test-utils";
import {mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import App from './App';

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

act(() => {
  it('Render App', () => {
    const component = mount(
      <Provider store={store}>
        <App/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
