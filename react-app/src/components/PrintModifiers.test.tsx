import { mount } from 'enzyme';
import React from 'react';
import { Modifiers } from '../model/key-bindings';
import PrintModifiers, { sortModifiers } from './PrintModifiers';

describe('sortModifiers', () => {
  it('should sort properly', () => {
    expect(
      sortModifiers(Modifiers(['Control']), Modifiers(['Shift'])),
    ).toBeLessThan(0);
    expect(
      sortModifiers(Modifiers(['Control', 'Alt']), Modifiers(['Shift'])),
    ).toBeGreaterThan(0);
  });
});

describe('PrintModifiers', () => {
  it('should print properly', () => {
    const wrapper = mount(
      <PrintModifiers modifiers={Modifiers(['Control', 'Shift', 'Alt'])} />,
    );

    expect(wrapper).toHaveText('C-A-⇧');
  });
});
