import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jestDiff from 'jest-diff';
import 'jest-enzyme';
import { DeepMap } from './model/types';

configure({ adapter: new Adapter() });

function getDeepMapComparer(
  jestThis: jest.MatcherUtils,
  digits: number | undefined,
): (expected: any, received: any) => boolean | undefined {
  const diff = digits === undefined ? undefined : 10 ** (-1 * digits);
  return (expected, received) => {
    if (
      diff !== undefined &&
      typeof expected === 'number' &&
      typeof received === 'number'
    ) {
      return Math.abs(expected - received) < expected * diff;
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
          [getDeepMapComparer(jestThis, digits)],
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
      getDeepMapComparer(this, digits),
    ]);

    return {
      pass,
      message: deepMatchMessage(expected, received, pass, this),
    };
  },
});
