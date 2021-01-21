import React from 'react';
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "../../../store/reducer";
import { act } from "react-dom/test-utils";
import {mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import {MapEditor} from '../index';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

act(() => {
  it('Render Loader when loading = true', () => {
    const component = mount(
      <Provider store={store}>
        <MapEditor/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });

  it("Should toggle loading on false and render whole component", () => {
    const newStore = mockStore({cities: { list: [{
      id:3, 
      city: "Dnipro", 
      delivery_area: [
        { lat: 48.468401, lng: 35.037788 },
        { lat: 48.464442, lng: 35.033042 },
        { lat: 48.462938, lng: 35.041843 }
      ]
    }], loading: false }})
    const component = mount(
      <Provider store={newStore}>
        <MapEditor/>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
