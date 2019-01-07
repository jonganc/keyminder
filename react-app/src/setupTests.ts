import jestDiff from 'jest-diff';
import { DeepMap } from './model/types';

// declare global {

// }

function getDeepMapComparer(
  jestThis: jest.MatcherUtils,
): (expected: any, received: any) => boolean | undefined {
  return (expected, received) => {
    switch ([received, expected].filter(val => val instanceof DeepMap).length) {
      case 0:
        return undefined;
      case 1:
        return false;
      case 2:
        return (jestThis.equals as any)(
          [...(received as DeepMap<any, any>)],
          expect.arrayContaining([...(expected as DeepMap<any, any>)]),
          [getDeepMapComparer(jestThis)],
        );
      default:
        throw new Error('Should never reach here');
    }
  };
}

// copied from Jest Expect utils

const MULTILINE_REGEXP = /[\r\n]/;

export const isOneline = (expected: any, received: any) =>
  typeof expected === 'string' &&
  typeof received === 'string' &&
  (!MULTILINE_REGEXP.test(expected) || !MULTILINE_REGEXP.test(received));

expect.extend({
  /**
   * like toEqual but match correctly on DeepMap
   */
  toEqualExtended(received, expected) {
    const pass = (this.equals as any)(received, expected, [
      getDeepMapComparer(this),
    ]);

    // copied from definition of toEqual
    const message = pass
      ? () =>
          this.utils.matcherHint('.not.toEqual') +
          '\n\n' +
          `Expected value to not equal:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(received)}`
      : () => {
          const oneline = isOneline(expected, received);
          const diffString = jestDiff(expected, received, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.toEqual') +
            '\n\n' +
            `Expected value to equal:\n` +
            `  ${this.utils.printExpected(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(received)}` +
            (diffString && !oneline ? `\n\nDifference:\n\n${diffString}` : '')
          );
        };

    return {
      pass,
      message,
    };
  },
});
