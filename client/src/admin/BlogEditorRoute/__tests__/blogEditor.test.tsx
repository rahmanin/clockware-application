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
import routeData from 'react-router';
import { BlogEditor } from "../index";

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
        <BlogEditor></BlogEditor>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });

  it("Should render whole component", () => {
    const newStore = mockStore(
      {
        news: { 
          list: [{id:3, content: "aaaa"}], 
          loading: false 
        },
      })
    const component = mount(
      <Provider store={newStore}>
        <BlogEditor></BlogEditor>
      </Provider>
    );
    expect(component.debug()).toMatchSnapshot();
  });
})
