import React from 'react';
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "../../../store/reducer";
import { act } from "react-dom/test-utils";
import {mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import Feedback from '../index';
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
  it('Render feedback form', () => {
    const component = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/feedback?token=aaaaaaaaaaaaaaa&order={%22size%22:%22Small%22,%22city%22:%22Uzhhorod%22,%22order_date%22:%222020-12-01%22,%22order_time_start%22:%2213:00%22,%22order_master%22:%22Alex%22,%22feedback_master%22:%22%22,%22order_price%22:110,%22additional_price%22:0}`]}>
          <Feedback/>
        </MemoryRouter>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
