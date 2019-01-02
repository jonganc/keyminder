import { Point } from './types';

describe('Point', () => {
  const point = new Point([1, 2]);
  it('should make a point', () => {
    expect(point.coords).toEqual([1, 2]);
  });

  it('should translate', () => {
    expect(point.translate(2, -3).coords).toEqual([3, -1]);
  });

  it('should scale uniformly', () => {
    expect(point.scale(2)).toEqual([2, 4]);
  });

  it('should scale non-uniformly', () => {
    expect(point.scale(2, 3)).toEqual([2, 6]);
  });
});

describe('Rectangle', () => {
  const rectangle = new Rectangle([[1, 2], [5, 4]]);
  it('should make a rectangle', () => {
    expect(re);
  });
});
