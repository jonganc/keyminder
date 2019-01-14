// tslint:disable-next-line:no-namespace
declare namespace jest {
  interface Matchers<R> {
    toEqualExtended(expected: any, digits?: number | undefined): R;
  }
}
