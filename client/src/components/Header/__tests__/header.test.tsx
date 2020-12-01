import {Header} from "../index"
import {Burger} from "../Burger"
import {Navbar} from "../Navbar"
import {RightNav} from "../RightNav"
import React from 'react';
import {cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import store from "../../../store/reducer";
import { act } from "react-dom/test-utils";
import {shallow} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });
afterEach(cleanup);

act(() => {
  it('Render Header', () => {
    const component = shallow(
      <Header />
    );
    expect(component).toMatchSnapshot();
  });
})

act(() => {
  it('Render Burger', () => {
    const component = shallow(
      <Burger />
    );
    expect(component).toMatchSnapshot();
  });
})

act(() => {
  it('Render Navbar', () => {
    const component = shallow(
      <Navbar />
    );
    expect(component).toMatchSnapshot();
  });
})

act(() => {
  it('Render RightNav', () => {
    const component = shallow(
      <Provider store={store}>
        <RightNav open={true} onClick={() => {return}}/>
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
})