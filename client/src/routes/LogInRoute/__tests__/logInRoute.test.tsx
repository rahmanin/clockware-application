import React from 'react';
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "../../../store/reducer";
import { act } from "react-dom/test-utils";
import {mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import LogIn from '../index';
import { MemoryRouter } from 'react-router';

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

act(() => {
  it('Render login form', () => {
    const component = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/login`]}>
          <LogIn/>
        </MemoryRouter>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });

  it("Render set password form", () => {
    const component = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/login?token=qwdqwqwqwqwdq`]}>
          <LogIn/>
        </MemoryRouter>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
