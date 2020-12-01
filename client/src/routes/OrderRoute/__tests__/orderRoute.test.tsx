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
import MakingOrder from '../index';

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

act(() => {
  it('Render Loader when loading = true', () => {
    const component = mount(
      <Provider store={store}>
        <MakingOrder/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });

  it("Should toggle loading on false and render whole component", () => {
    const newStore = mockStore(
      {
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
      })
    const component = mount(
      <Provider store={newStore}>
        <MakingOrder/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
