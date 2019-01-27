import l_ from 'lodash';
import { IObservableArray, observable } from 'mobx';

export type RawPoint = [number, number];

export type RawRectangle = [RawPoint, RawPoint];

/**
 * a 2-D shape
 */
export class Rectangle {
  public readonly points: RawRectangle;

  constructor(rawRectangle: RawRectangle) {
    this.points = Object.freeze(
      rawRectangle.map(rp => Object.freeze([...rp])),
    ) as RawRectangle;
  }

  get width() {
    return this.points[1][0] - this.points[0][0];
  }

  get height() {
    return this.points[1][1] - this.points[0][1];
  }

  translate(x: number, y: number): Rectangle {
    return new Rectangle(this.points.map(p => [
      p[0] + x,
      p[1] + y,
    ]) as RawRectangle);
  }

  scale(r: number): Rectangle;
  // tslint:disable-next-line:unified-signatures
  scale(x: number, y: number): Rectangle;
  scale(rOrX: number, y?: number): Rectangle {
    const [xFactor, yFactor] = y === undefined ? [rOrX, rOrX] : [rOrX, y];
    return new Rectangle(this.points.map(p => [
      p[0] * xFactor,
      p[1] * yFactor,
    ]) as RawRectangle);
  }
}

/**
 * A map that uses (lodash's) l_.isEqual for determining key equality. The key should be treated as immutable or *bad things* might happen
 */
export class DeepMap<K, V> implements Map<K, V> {
  readonly [Symbol.toStringTag]: string = 'DeepMap';

  private _pairs: IObservableArray<[K, V]>;

  constructor(_pairs: Array<[K, V]>) {
    this._pairs = observable.array<[K, V]>(_pairs);
  }

  /** Returns an iterable of entries in the map. */
  *[Symbol.iterator](): IterableIterator<[K, V]> {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._pairs.length; i++) {
      yield this._pairs[i];
    }
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  entries(): IterableIterator<[K, V]> {
    return this[Symbol.iterator]();
  }

  clear(): void {
    this._pairs.clear();
  }

  delete(key: K): boolean {
    for (const [idx, pair] of this._pairs.entries()) {
      if (l_.isEqual(pair[0], key)) {
        this._pairs.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  forEach(
    callbackfn: (value: V, key: K, map: DeepMap<K, V>) => void,
    thisArg?: any,
  ): void {
    for (const pair of this._pairs) {
      callbackfn.apply(thisArg, [pair[1], pair[0], this]);
    }
  }

  get(key: K): V | undefined {
    for (const pair of this._pairs) {
      if (l_.isEqual(pair[0], key)) {
        return pair[1];
      }
    }
    return undefined;
  }

  has(key: K): boolean {
    for (const pair of this._pairs) {
      if (l_.isEqual(pair[0], key)) {
        return true;
      }
    }
    return false;
  }

  set(key: K, value: V): this {
    for (const pair of this._pairs) {
      if (l_.isEqual(pair[0], key)) {
        pair[1] = value;
        return this;
      }
    }
    this._pairs.push([key, value]);
    return this;
  }

  get size(): number {
    return this._pairs.length;
  }

  /**
   * Returns an iterable of keys in the map
   */
  *keys(): IterableIterator<K> {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._pairs.length; i++) {
      yield this._pairs[i][0];
    }
  }

  /**
   * Returns an iterable of values in the map
   */
  *values(): IterableIterator<V> {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._pairs.length; i++) {
      yield this._pairs[i][1];
    }
  }
}

export interface ReadonlyDeepMap<K, V>
  extends Omit<DeepMap<K, V>, 'get' | 'set' | 'clear' | 'delete' | 'forEach'>,
    ReadonlyMap<K, V> {
  forEach(
    callbackfn: (value: V, key: K, map: ReadonlyDeepMap<K, V>) => void,
    thisArg?: any,
  ): void;
}

/**
 * Like lodash's groupBy except that it groups using pairwise lodash isEqual
 */
export function groupByDeep<T, U>(
  arr: T[],
  groupFunc: (val: T) => U,
): DeepMap<U, [T, ...T[]]> {
  const groups: Array<[U, [T, ...T[]]]> = [];
  for (const elt of arr) {
    const matcher = groupFunc(elt);
    let didGroup = false;
    for (const group of groups) {
      if (l_.isEqual(group[0], matcher)) {
        group[1].push(elt);
        didGroup = true;
        break;
      }
    }
    if (!didGroup) {
      groups.push([matcher, [elt]]);
    }
  }

  return new DeepMap(groups);
}

export type Label = string | React.Component;

export type Omit<
  Obj extends object,
  ToOmit extends string | number | symbol
> = Pick<Obj, Exclude<keyof Obj, ToOmit>>;

// we do this by converting to arrays because I'm not sure we'll even use sets in the long run
export function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set<T>(l_.difference([...set1, ...set2]));
}

export function doSetsIntersect(
  set1: ReadonlySet<any>,
  set2: ReadonlySet<any>,
): boolean {
  for (const from1 of set1) {
    if (set2.has(from1)) {
      return true;
    }
  }
  return false;
}

/**
 * Check that input is not an instance of class. This is useful because of the
 */
// tslint:disable-next-line:ban-types
export function shouldNotBeInstance(cls: Function, input: any) {
  if (input instanceof cls) {
    throw new Error(`Input should not be an instance of ${cls.name}`);
  }
}

// tslint:disable-next-line:ban-types
export function shouldBeInstance(cls: Function, input: any) {
  if (!(input instanceof cls)) {
    throw new Error(`Input should be an instance of ${cls.name}`);
  }
}
