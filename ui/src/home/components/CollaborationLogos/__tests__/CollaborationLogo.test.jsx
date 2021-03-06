import React from 'react';
import { shallow } from 'enzyme';

import CollaborationLogo from '../CollaborationLogo';

describe('CollaborationLogo', () => {
  it('render with all props', () => {
    const wrapper = shallow(
      <CollaborationLogo
        name="CERN"
        href="https://home.cern"
        src="/link/to/logo.png"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
