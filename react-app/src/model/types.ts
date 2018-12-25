export type RawPoint = [number, number];

/**
 * a point on the edge of a keyboard key, given by an x and y coordinate
 * the units are essentially arbitrary: the length of the space will be filled by all the KeyCap's.
 */
export class Point {
  constructor(public readonly coords: RawPoint) {}
  translate(x: number, y: number): Point {
    return new Point([this.coords[0] + x, this.coords[1] + y]);
  }
}

export type RawShape = [RawPoint, RawPoint, RawPoint, ...RawPoint[]];

type ShapePoints = [Point, Point, Point, ...Point[]];

/**
 * the shape of a keyboard key
 * Being a non-flat 2-dimensional objects, it needs at least three points
 */
export class Shape {
  static fromRawShape(rawShape: RawShape) {
    return new Shape(rawShape.map(rp => new Point(rp)) as ShapePoints);
  }

  constructor(public readonly points: ShapePoints) {}

  translate(x: number, y: number): Shape {
    return new Shape(this.points.map(p => p.translate(x, y)) as ShapePoints);
  }
}

function notImplementedYet(..._: any[]) {
  throw new Error('Not implemented yet');
}

/**
 * A map that uses (lodash's) l_.isEqual for determining key equality
 */
export class DeepMap<K, V> {
  constructor(private _pairs: Array<[K, V]>) {}

  clear(): void {
    this._pairs = [];
  }

  delete(key: K): boolean {
    notImplementedYet(key);
    return false;
  }

  forEach(
    callbackfn: (value: V, key: K, map: DeepMap<K, V>) => void,
    thisArg?: any,
  ): void {
    notImplementedYet(callbackfn, thisArg);
  }

  get(key: K): V | undefined {
    notImplementedYet(key);
    return undefined;
  }

  has(key: K): boolean {
    notImplementedYet(key);
    return false;
  }

  set(key: K, value: V): this {
    notImplementedYet(key, value);
    return this;
  }

  get size(): number {
    return this._pairs.length;
  }

  /** Returns an iterable of entries in the map. */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    notImplementedYet();
    return [][Symbol.iterator]();
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  entries(): IterableIterator<[K, V]> {
    notImplementedYet();
    return [][Symbol.iterator]();
  }

  /**
   * Returns an iterable of keys in the map
   */
  keys(): IterableIterator<K> {
    notImplementedYet();
    return [][Symbol.iterator]();
  }

  /**
   * Returns an iterable of values in the map
   */
  values(): IterableIterator<V> {
    notImplementedYet();
    return [][Symbol.iterator]();
  }
}

export type Label = string | React.Component;

export type Omit<
  Obj extends object,
  ToOmit extends string | number | symbol
> = Pick<Obj, Exclude<keyof Obj, ToOmit>>;
