import React from 'react';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "../../../store/reducer";
import { act } from "react-dom/test-utils";
import {mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import {Orders} from '../index';
import routeData from 'react-router';

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

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const mockLocation = {
  pathname: '/welcome',
  hash: '',
  search: '',
  state: ''
}
beforeEach(() => {
  jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation)
});

act(() => {
  it('Render Loader when loading = true', () => {
    const component = mount(
      <Provider store={store}>
        <Orders/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });

  it("Should toggle loading on false and render whole component", () => {
    const newStore = mockStore(
      {
        masters: { 
          list: [{id:3, master_name: "Master"}], 
          loading: false 
        },
        cities: { 
          list: [{id:3, city: "aaaaa"}], 
          loading: false 
        },
        user: { 
          list: [{id:1, role: "admin"}], 
          loading: false 
        },
        prices: { 
          list: [{id:1, size: "any", price: 666}], 
          loading: false 
        },
        orders: { 
          list: [{}], 
          loading: false 
        }
      })
    const component = mount(
      <Provider store={newStore}>
        <Orders/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
