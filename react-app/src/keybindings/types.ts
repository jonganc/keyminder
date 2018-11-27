import * as l_ from 'lodash';

// to decide
// should '!' and Shift-'1' be distinct? should '!' even be a key?

// for a printable ASCII key: a single character, upper or lower case as appropriate (e.g. 'a' or 'A' or '$')
// for non-printable keys: a snake-case, multi-character, english ascii string, e.g. 'return' or 'kp_1' (unless there is a particular reason to break these conventions, e.g. if an uppercase or non-Ascii is an essential distinction of the command; for example, if there existed 'kp-U' and 'kp-u' and 'kp-ü')
// for printable non-US keys
//  any string with non-ascii characters (e.g., 'üfoo') is allowed. we don't set a standard on how to represent it for languages with non-unique unicode representations of strings

/**
 * this is a list of known keys. it isn't used or enforced at the moment but is a reference
 */

const firstAscii = ' '.charCodeAt();
const lastAscii = '~'.charCodeAt();

export const keys = new Set([
  /**
   * Standard US QWERTY keyboard
   */

  /**
   * * Main part of keyboard *
   */

  // Printable ASCII characters
  ...l_.times(lastAscii - firstAscii + 1, offset =>
    String.fromCharCode(firstAscii + offset),
  ),

  // modifiers
  'shift_l',
  'shift_r',
  'alt_l',
  'alt_r',
  'win_l',
  'win_r',

  // other control keys
  'menu',
  'backspace',
  'caps_lock',
  'return',

  /**
   * * Above main part *
   */
  'escape',
  // function keys 1-15
  [..._.times(15, idx => `fn${idx + 1}`)],

  /**
   * * Between main and keypad *
   */
  'print',
  'sysrq',
  'pause',
  'break',
  'insert',
  'delete',
  'home',
  'end',
  'page_up',
  'page_down',
  'left',
  'up',
  'down',
  'right',

  /**
   * * Keypad *
   */
  ...[
    [
      ..._.times(10, idx => idx + ''),
      '/',
      '*',
      '-',
      'insert',
      'delete',
      'home',
      'end',
      'page_up',
      'page_down',
      'left',
      'up',
      'down',
      'right',
      'enter',
    ].map(init => `kp_${init}`),
  ],

  'super_l',
  'super_r',
  'control_l',
  'control_r',
  'hyper_l',
  'hyper_r',
  'num_lock',
  'scroll_lock',
  'insert',
  'delete',
  'home',
  'end',
  'page_up',
  'page_down',
  'up',
  'down',
  'left',
  'right',
  'scroll_lock',
  'pause',
  'break',
  'print',
  'sys_req',
  'tab',
]);

export type Key = string;

export type Modifier = 'ctl' | 'alt' | 'shift';

/**
 * a key with appropriate modifiers
 */
export interface ModdedKey {
  /**
   * the key on the keyboard
   */
  key: string;
  /**
   * the modifiers applied to the key
   */
  modifiers: Modifier[];
}

export type CompoundKey = AbstractKey;
