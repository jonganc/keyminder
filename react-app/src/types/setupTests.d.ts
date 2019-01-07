declare namespace jest {
  interface Matchers<R> {
    toEqualExtended(expected: any): R;
  }
}
