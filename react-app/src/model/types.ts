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
