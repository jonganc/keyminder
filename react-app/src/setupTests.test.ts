import { DeepMap } from './model/types';

describe('toEqualExtended', () => {
  // it('should allow equality to best tested with no DeepMaps', () => {
  //   expect([1, 2, [3]]).toEqualExtended(expect.arrayContaining([[3], 2, 1]));
  // });
  it('should set a DeepMap not equal to a non-DeepMap', () => {
    expect([[1, 2]]).not.toEqualExtended(new DeepMap([[1, 2]]));
  });
  // it("should succeed when two DeepMap's are the same", () => {
  //   expect(
  //     new DeepMap<any, number>([[new Set([1, 2]), 2], [2, 3]]),
  //   ).toEqualExtended(new DeepMap<any, number>([[2, 3], [new Set([2, 1]), 2]]));
  // });
});
