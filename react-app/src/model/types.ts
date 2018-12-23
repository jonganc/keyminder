function notImplementedYet(..._: any[]) {
  throw new Error('Not implemented yet');
}

/**
 * A map that uses (lodash's) l_.isEqual for determining key equality
 */
export class DeepMap<Key, Value> {
  constructor(private _pairs: Array<[Key, Value]>) {}

  public clear(): void {
    this._pairs = [];
  }
  public delete(key: Key): boolean {
    notImplementedYet(key);
    return false;
  }
  public forEach(
    callbackfn: (value: Value, key: Key, map: DeepMap<Key, Value>) => void,
    thisArg?: any,
  ): void {
    notImplementedYet(callbackfn, thisArg);
  }
  public get(key: Key): Value | undefined {
    notImplementedYet(key);
    return undefined;
  }
  public has(key: Key): boolean {
    notImplementedYet(key);
    return false;
  }
  public set(key: Key, value: Value): this {
    notImplementedYet(key, value);
    return this;
  }
  public get size(): number {
    return this._pairs.length;
  }
}

export type Label = string | React.Component;
