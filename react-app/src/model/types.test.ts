import { DeepMap, Rectangle, groupByDeep } from './types';

describe('Rectangle', () => {
  const rectangle = new Rectangle([[1, 2], [5, 4]]);
  it('should make a rectangle', () => {
    expect(rectangle.points).toEqual([[1, 2], [5, 4]]);
  });

  it('should translate', () => {
    expect(rectangle.translate(2, -3).points).toEqual([[3, -1], [7, 1]]);
  });

  it('should scale uniformly', () => {
    expect(rectangle.scale(2).points).toEqual([[2, 4], [10, 8]]);
  });

  it('should scale non-uniformly', () => {
    expect(rectangle.scale(2, 3).points).toEqual([[2, 6], [10, 12]]);
  });
});

describe('DeepMap', () => {
  let deepMap: DeepMap<Record<string, string>, number>;

  beforeEach(() => {
    deepMap = new DeepMap([
      [{ lhsKey: 'lhs-val-1' }, 1],
      [{ lhsKey: 'lhs-val-2' }, 2],
    ]);
  });

  it('should produce the expected iterator', () => {
    expect([...deepMap]).toEqual(
      expect.arrayContaining([
        [{ lhsKey: 'lhs-val-1' }, 1],
        [{ lhsKey: 'lhs-val-2' }, 2],
      ]),
    );
  });

  it('should generate an iterator for entries', () => {
    expect([...deepMap.entries()]).toEqual(
      expect.arrayContaining([
        [{ lhsKey: 'lhs-val-1' }, 1],
        [{ lhsKey: 'lhs-val-2' }, 2],
      ]),
    );
  });

  it('should allow all entries to be cleared', () => {
    deepMap.clear();
    expect([...deepMap.entries()]).toEqual([]);
  });

  it('should allow a key to be deleted', () => {
    expect(deepMap.delete({ lhsKey: 'lhs-val-3' })).toBeFalsy();
    expect([...deepMap]).toEqual(
      expect.arrayContaining([
        [{ lhsKey: 'lhs-val-1' }, 1],
        [{ lhsKey: 'lhs-val-2' }, 2],
      ]),
    );
    expect(deepMap.delete({ lhsKey: 'lhs-val-1' })).toBeTruthy();
    expect([...deepMap]).toEqual([[{ lhsKey: 'lhs-val-2' }, 2]]);
  });

  it('should call a callback for each entry', () => {
    const callsWithThis: any[][] = [];
    const theThis = {};
    deepMap.forEach(function(this: any, ...args: any[]) {
      callsWithThis.push([...args, this]);
    }, theThis);

    expect(callsWithThis).toEqual(
      expect.arrayContaining([
        [1, { lhsKey: 'lhs-val-1' }, deepMap, theThis],
        [2, { lhsKey: 'lhs-val-2' }, deepMap, theThis],
      ]),
    );
  });

  it('should get a single key', () => {
    expect(deepMap.get({ lhsKey: 'lhs-val-1' })).toEqual(1);
  });

  it('should check if a key is set', () => {
    expect(deepMap.has({ lhsKey: 'lhs-val-1' })).toBeTruthy();
    expect(deepMap.has({ lhsKey: 'lhs-val-3' })).toBeFalsy();
  });

  it('should set a single key', () => {
    expect(deepMap.set({ lhsKey: 'lhs-val-1' }, 5)).toBe(deepMap);
    expect(deepMap.get({ lhsKey: 'lhs-val-1' })).toEqual(5);
  });

  it('should return the number of keys', () => {
    expect(deepMap.size).toBe(2);
  });

  it('should generate an iterator for keys', () => {
    expect([...deepMap.keys()]).toEqual(
      expect.arrayContaining([
        { lhsKey: 'lhs-val-1' },
        { lhsKey: 'lhs-val-2' },
      ]),
    );
  });

  it('should generate an iterator for values', () => {
    expect([...deepMap.values()]).toEqual(expect.arrayContaining([1, 2]));
  });
});

describe('groupByDeep', () => {
  it('group appropriately', () => {
    const toGroup = [
      [{ lhsKey: 'val1' }, 1],
      [{ lhsKey: 'val2' }, 2],
      [{ lhsKey: 'val1' }, 3],
      [{ lhsKey: 'val1' }, 4],
    ];

    const groupedMap = groupByDeep(toGroup, elt => elt[0]);
    expect([...groupedMap.entries()]).toEqual(
      expect.arrayContaining([
        [
          { lhsKey: 'val1' },
          expect.arrayContaining([toGroup[0], toGroup[2], toGroup[3]]),
        ],
        [{ lhsKey: 'val2' }, [toGroup[1]]],
      ]),
    );
  });
});
