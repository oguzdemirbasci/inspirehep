import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import Address from '../Address';

describe('Address', () => {
  it('renders with only city', () => {
    const address = fromJS({
      cities: ['Geneva', 'Ignored'],
    });
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with only country', () => {
    const address = fromJS({
      country: 'Switzerland',
    });
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with only place name', () => {
    const address = fromJS({
      place_name: 'CERN',
    });
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with city and country', () => {
    const address = fromJS({
      cities: ['Geneva', 'Ignored'],
      country: 'Switzerland',
    });
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders all', () => {
    const address = fromJS({
      cities: ['Meyrin'],
      country: 'Switzerland',
      state: 'Geneva',
      place_name: 'CERN',
    });
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders empty', () => {
    const address = fromJS({});
    const wrapper = shallow(<Address address={address} />);
    expect(wrapper).toMatchSnapshot();
  });
});
