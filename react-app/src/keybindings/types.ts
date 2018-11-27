import * as l_ from 'lodash';

// Note:
//  paths that start 'X11/' are with respect to /usr/include/X11/ (on a linux system) or https://cgit.freedesktop.org/xorg/proto/x11proto/tree
// Note: paths that start 'xkb' are with respect to /usr/share/X11/xkb/ (on a linux system) or https://cgit.freedesktop.org/xkeyboard-config/tree/

/**
 * a key from a keyboard press. Name are as XOrg keysym's, i.e. as in X11/keysymdef.h, with 'XK_' prefix removed, or X11/XF86keysym.h, with 'XF86XK_' prefix removed
 * E.g. 'BackSpace' or 'U' or 'comma' or 'AudioLowerVolume'
 */
export type Key = string;

// X has 8 modifers (https://www.x.org/releases/X11R7.7/doc/libX11/libX11/libX11.html#Keyboard_Grabbing): Shift, Lock, Control, Mod1, Mod2, Mod3, Mod4 and Mod5
// Alt, Meta are typically mod1 (via /xkb/symbols/altwin(meta_alt) from /xkb/symbols/pc(pc105) )
// Win keys are typically mod4 (via /xkb/symbols/pc(pc105))

// Alt, Meta are typically mod1 (via /xkb/symbols/pc and /xkb/symbols/altwin)

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
