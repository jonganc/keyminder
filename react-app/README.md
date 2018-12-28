This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Commonly used terms (interface/class name)

### key code (KeyCode)

The abstract representation of a the key at a particular place on a keyboard. For example, AE01 represents the key which is typically the "Q" key on a US keyboard.

Since different keyboards layouts (e.g. different languages or Qwerty vs. Dvorak) have different meanings for the key in a particular location, the key code is separate from what the key actually does when pressed.

We use the same codes as in XWindows, which are all 4-letter strings, e.g. "TLDE" for (the standard location of) the '~' character, "AE01" for the '1' key, "AD01" for the 'q' key.

[In text, we refer to a key code in quotes, e.g. "AE01"]

### key-event (KeyEvent)

The most basic unit of a key sequence, e.g. "A" or "PageUp", and which can be modified with modifiers like "Shift" or "Control".

Key names match what would be in the KeyboardEvent.key property of a keyboard event in a web browser. In particular:
- for keys with a printed representation, the name is the Unicode representation of the printed key, e.g. 'a' or '@'
- for non-printable keys, the names are given at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values, e.g. "Alt", "NumLock"

### key-event labels (KeyEventLabels)

A mapping of key events to how they should be labeled.

### modifiers (Modifiers)

A key that, when pressed, alter the effect of other keys, e.g. Shift, Control. Usually implemented as a set of strings.

[In text, these are represented as unquoted, e.g. Shift or Shift-A. Thus, the key-event from pressing the Shift key would be "Shift", whereas pressing Shift plus the A key would be represented Shift-A. We generally adopt the ordering Control-Alt-Win-Meta-Hyper-Shift-...]

### localized keys (LocalizedKeys...)

A keyboard localization, i.e. a mapping giving the meaning of a KeyCode being pressed with a given set of modifers. Combined with key-event labels, these correspond to a physical keyboard's key cap, that is, what each key press does and what is printed on the key.

### key-cap (KeyCap)

The representation of a key-cap, that is, something that, when bound to a key code, specifies what key-events occur when the key is pressed with different bindings and what those key events are represented as

### physical key (PhysicalKey)

The representation of a physical key on a keyboard, which includes
- the key-code represented by the key
- the shape of the key
- the key events reachable via the key, which is a map which takes a set of modifiers to a key-event along with a label

### physical key press (FIX: Is this needed?)

A particular key pressed along with any modifiers, e.g. "2" pressed along with Control+Shift.

[In text, denoted unquoted, e.g. Shift-2]

## physical key binding (PhysicalKeyBinding...)

