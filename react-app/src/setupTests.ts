import jestDiff from 'jest-diff';
import { DeepMap } from './model/types';

function getIsCloseComparer(
  digits: number,
): (expected: any, received: any) => boolean | undefined {
  const diff = 10 ** (-1 * digits);
  return (expected, received) => {
    switch (
      [expected, received].filter(val => typeof val === 'number').length
    ) {
      case 0:
      case 1:
        return undefined;
      case 2:
        return Math.abs(expected - received) < diff;
      default:
        throw new Error('Should never reach here');
    }
  };
}

function getDeepMapComparer(
  jestThis: jest.MatcherUtils,
  digits?: number | undefined,
): (expected: any, received: any) => boolean | undefined {
  const diff = digits === undefined ? undefined : 10 ** (-1 * digits);
  return (expected, received) => {
    if (
      diff !== undefined &&
      typeof expected === 'number' &&
      typeof received === 'number'
    ) {
      return Math.abs(expected - received) < diff;
    }

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

function deepMatchMessage(
  expected: any,
  received: any,
  pass: boolean,
  jestThis: jest.MatcherUtils,
): () => string {
  // copied from definition of toEqual
  return pass
    ? () =>
        jestThis.utils.matcherHint('.not.toEqual') +
        '\n\n' +
        `Expected value to not equal:\n` +
        `  ${jestThis.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${jestThis.utils.printReceived(received)}`
    : () => {
        const oneline = isOneline(expected, received);
        const diffString = jestDiff(expected, received, {
          expand: jestThis.expand,
        });
        return (
          jestThis.utils.matcherHint('.toEqual') +
          '\n\n' +
          `Expected value to equal:\n` +
          `  ${jestThis.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${jestThis.utils.printReceived(received)}` +
          (diffString && !oneline ? `\n\nDifference:\n\n${diffString}` : '')
        );
      };
}

expect.extend({
  /**
   * like toEqual but match correctly on DeepMap. The second argument can be the number of digits of precision to match to.
   */
  toEqualExtended(received, expected, digits: number) {
    const pass = (this.equals as any)(received, expected, [
      getDeepMapComparer(this),
    ]);

    return {
      pass,
      message: deepMatchMessage(expected, received, pass, this),
    };
  },
});
