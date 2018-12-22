// a dummy keyboard for testing

import { Geometry, Point, Shape } from './model/keyboard-layout';

const basicKeyCapShape = Shape.fromRawShape([
  [0, 0],
  [20, 0],
  [20, 20],
  [0, 20],
]);

export const dummy: Geometry = [
  {
    keyCode: 'AE01',
    shape: basicKeyCapShape,
  },
  {
    keyCode: 'AE02',
    shape: basicKeyCapShape.translate(25, 0),
  },
  {
    keyCode: 'e',
    shape: basicKeyCapShape.translate(50, 0),
  },
  {
    keyCode: 'a',
    shape: basicKeyCapShape.translate(0, 25),
  },
  {
    keyCode: 's',
    shape: basicKeyCapShape.translate(25, 25),
  },
  {
    keyCode: 'd',
    shape: basicKeyCapShape.translate(50, 25),
  },
  {
    keyCode: '',
    shape: basicKeyCapShape.translate(50, 25),
  },
];
