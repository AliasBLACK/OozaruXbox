/**
 *  Oozaru: Sphere for the Web
 *  Copyright (c) 2016-2024, Fat Cerberus
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  * Neither the name of Spherical nor the names of its contributors may be
 *    used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
**/

export
const Key =
{
	Alt: 0,
	AltGr: 1,
	Apostrophe: 2,
	Backslash: 3,
	Backspace: 4,
	CapsLock: 5,
	CloseBrace: 6,
	Comma: 7,
	Delete: 8,
	Down: 9,
	End: 10,
	Enter: 11,
	Equals: 12,
	Escape: 13,
	F1: 14,
	F2: 15,
	F3: 16,
	F4: 17,
	F5: 18,
	F6: 19,
	F7: 20,
	F8: 21,
	F9: 22,
	F10: 23,
	F11: 24,
	F12: 25,
	Home: 26,
	Hyphen: 27,
	Insert: 28,
	LCtrl: 29,
	LShift: 30,
	Left: 31,
	NumLock: 32,
	OpenBrace: 33,
	PageDown: 34,
	PageUp: 35,
	Period: 36,
	RCtrl: 37,
	RShift: 38,
	Right: 39,
	ScrollLock: 40,
	Semicolon: 41,
	Slash: 42,
	Space: 43,
	Tab: 44,
	Tilde: 45,
	Up: 46,
	A: 47,
	B: 48,
	C: 49,
	D: 50,
	E: 51,
	F: 52,
	G: 53,
	H: 54,
	I: 55,
	J: 56,
	K: 57,
	L: 58,
	M: 59,
	N: 60,
	O: 61,
	P: 62,
	Q: 63,
	R: 64,
	S: 65,
	T: 66,
	U: 67,
	V: 68,
	W: 69,
	X: 70,
	Y: 71,
	Z: 72,
	D1: 73,
	D2: 74,
	D3: 75,
	D4: 76,
	D5: 77,
	D6: 78,
	D7: 79,
	D8: 80,
	D9: 81,
	D0: 82,
	NumPad1: 83,
	NumPad2: 84,
	NumPad3: 85,
	NumPad4: 86,
	NumPad5: 87,
	NumPad6: 88,
	NumPad7: 89,
	NumPad8: 90,
	NumPad9: 91,
	NumPad0: 92,
	NumPadEnter: 93,
	Add: 94,
	Decimal: 95,
	Divide: 96,
	Multiply: 97,
	Subtract: 98,
};

const keyCode =
{
	ArrowLeft: Key.Left,
	ArrowRight: Key.Right,
	ArrowDown: Key.Down,
	ArrowUp: Key.Up,
	Backquote: Key.Tilde,
	Backslash: Key.Backslash,
	Backspace: Key.Backspace,
	BracketLeft: Key.OpenBrace,
	BracketRight: Key.CloseBrace,
	Comma: Key.Comma,
	Delete: Key.Delete,
	Digit0: Key.D0,
	Digit1: Key.D1,
	Digit2: Key.D2,
	Digit3: Key.D3,
	Digit4: Key.D4,
	Digit5: Key.D5,
	Digit6: Key.D6,
	Digit7: Key.D7,
	Digit8: Key.D8,
	Digit9: Key.D9,
	End: Key.End,
	Enter: Key.Enter,
	Equal: Key.Equals,
	Escape: Key.Escape,
	F1: Key.F1,
	F2: Key.F2,
	F3: Key.F3,
	F4: Key.F4,
	F5: Key.F5,
	F6: Key.F6,
	F7: Key.F7,
	F8: Key.F8,
	F9: Key.F9,
	F10: Key.F10,
	F11: Key.F11,
	F12: Key.F12,
	Home: Key.Home,
	Insert: Key.Insert,
	KeyA: Key.A,
	KeyB: Key.B,
	KeyC: Key.C,
	KeyD: Key.D,
	KeyE: Key.E,
	KeyF: Key.F,
	KeyG: Key.G,
	KeyH: Key.H,
	KeyI: Key.I,
	KeyJ: Key.J,
	KeyK: Key.K,
	KeyL: Key.L,
	KeyM: Key.M,
	KeyN: Key.N,
	KeyO: Key.O,
	KeyP: Key.P,
	KeyQ: Key.Q,
	KeyR: Key.R,
	KeyS: Key.S,
	KeyT: Key.T,
	KeyU: Key.U,
	KeyV: Key.V,
	KeyW: Key.W,
	KeyX: Key.X,
	KeyY: Key.Y,
	KeyZ: Key.Z,
	Minus: Key.Hyphen,
	Numpad0: Key.NumPad0,
	Numpad1: Key.NumPad1,
	Numpad2: Key.NumPad2,
	Numpad3: Key.NumPad3,
	Numpad4: Key.NumPad4,
	Numpad5: Key.NumPad5,
	Numpad6: Key.NumPad6,
	Numpad7: Key.NumPad7,
	Numpad8: Key.NumPad8,
	Numpad9: Key.NumPad9,
	NumpadAdd: Key.Add,
	NumpadDecimal: Key.Decimal,
	NumpadDivide: Key.Divide,
	NumpadEnter: Key.NumPadEnter,
	NumpadMultiply: Key.Multiply,
	NumpadSubtract: Key.Subtract,
	PageDown: Key.PageDown,
	PageUp: Key.PageUp,
	Period: Key.Period,
	Quote: Key.Apostrophe,
	Semicolon: Key.Semicolon,
	Slash: Key.Slash,
	Space: Key.Space,
	Tab: Key.Tab,
	ShiftLeft: Key.LShift,
	ControlLeft: Key.LCtrl,
	AltLeft: Key.AltGr,
	ShiftRight: Key.RShift,
	ControlRight: Key.RCtrl,
	AltRight: Key.AltGr
}

export
const MouseKey =
{
	Left: 0,
	Middle: 1,
	Right: 2,
	Back: 3,
	Forward: 4,
	WheelUp: 5,
	WheelDown: 6,
};

var buttonStates = {};
var keyQueue = [];
globalThis.charQueue = [];
var keyStates = { '': false };
var lastMouseX = undefined;
var lastMouseY = undefined;
var mouseQueue = [];
var nullJoystick;

export default
class InputEngine
{
	static initialize(canvas)
	{
		canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});

		canvas.addEventListener('keydown', (e) => {
			e.preventDefault();
			keyStates[e.code] = true;

			// Push to keyQueue.
			const code = keyCode[e.code]
			keyQueue.push(code)

			// Push to charQueue.
			const char = Keyboard.Default.charOf(code, Keyboard.Default.isPressed(Key.LShift) || Keyboard.Default.isPressed(Key.RShift))
			if (char != "")  charQueue.push(char)
		});
		canvas.addEventListener('keyup', e => {
			e.preventDefault();
			keyStates[e.code] = false;
		});

		canvas.addEventListener('mousemove', (e) => {
			e.preventDefault();
			lastMouseX = e.offsetX;
			lastMouseY = e.offsetY;
		});
		canvas.addEventListener('mouseout', (e) => {
			e.preventDefault();
			lastMouseX = undefined;
			lastMouseY = undefined;
		});
		canvas.addEventListener('mousedown', (e) => {
			e.preventDefault();
			canvas.focus();
			const key = e.button === 1 ? MouseKey.Middle
				: e.button === 2 ? MouseKey.Right
				: e.button === 3 ? MouseKey.Back
				: e.button === 4 ? MouseKey.Forward
				: MouseKey.Left;
			buttonStates[key] = true;
		});
		canvas.addEventListener('mouseup', (e) => {
			e.preventDefault();
			const key = e.button === 1 ? MouseKey.Middle
				: e.button === 2 ? MouseKey.Right
				: e.button === 3 ? MouseKey.Back
				: e.button === 4 ? MouseKey.Forward
				: MouseKey.Left;
			buttonStates[key] = false;
			mouseQueue.push({
				key,
				x: e.offsetX,
				y: e.offsetY,
			});
		});
		canvas.addEventListener('wheel', (e) => {
			e.preventDefault();
			const key = e.deltaY < 0.0 ? MouseKey.WheelUp
				: MouseKey.WheelDown;
			mouseQueue.push({
				key,
				delta: Math.abs(e.deltaY),
				x: e.offsetX,
				y: e.offsetY,
			});
		});

		nullJoystick = new Joystick();
		window.addEventListener("gamepadconnected", (e) => {
			if (e.gamepad.index < Joystick.Joysticks.length)
				Joystick.Joysticks[e.gamepad.index] = new Joystick(e.gamepad.index);
		});
		window.addEventListener("gamepaddisconnected", (e) => {
			if (e.gamepad.index < Joystick.Joysticks.length)
				Joystick.Joysticks[e.gamepad.index] = nullJoystick;
		});
	}
}

export
class Joystick
{
	#index;

	static Joysticks = Array(4).fill(nullJoystick);
	static get P1() { return this.Joysticks[0]; }
	static get P2() { return this.Joysticks[1]; }
	static get P3() { return this.Joysticks[2]; }
	static get P4() { return this.Joysticks[3]; }
	static getDevices() { return this.Joysticks; }

	static ButtonMapper(buttonID)
	{
		switch(buttonID)
		{
			case 10: return 15;
			case 11: return 14;
			case 12: return 13;
			case 13: return 12;
			case 4: return 5;
			case 5: return 4;
			case 6: return 11;
			case 7: return 10;
			default: return buttonID;
		}
	}

	constructor(index)
	{
		print("New Joystick connected: " + index)
		this.#index = index;
	}

	get name()
	{
		if (this.#index == null) return "Null Device";
		return navigator.getGamepads()[this.#index].id;
	}

	get numAxes()
	{
		if (this.#index == null) return Infinity;
		return navigator.getGamepads()[this.#index].axes.length;
	}

	get numButtons()
	{
		if (this.#index == null) return Infinity;
		return navigator.getGamepads()[this.#index].buttons.length;
	}

	getPosition(axisID)
	{
		if (this.#index == null) return 0.0;
		return axisID == 4 ?
			navigator.getGamepads()[this.#index].buttons[6].value
			: axisID == 5 ?
				navigator.getGamepads()[this.#index].buttons[7].value
				: navigator.getGamepads()[this.#index].axes[axisID];
	}

	isPressed(buttonID)
	{
		if (this.#index == null) return false;
		buttonID = this.constructor.ButtonMapper(buttonID)
		return navigator.getGamepads()[this.#index].buttons[buttonID].pressed;
	}
}

export
class Keyboard
{
	static get Default()
	{
		return this;
	}

	static get capsLock()
	{
		return false;
	}

	static get numLock()
	{
		return false;
	}

	static get scrollLock()
	{
		return false;
	}

	static charOf(key, shifted = false)
	{
		return key === Key.Space ? " "
			: key === Key.Apostrophe ? shifted ? "\"" : "'"
			: key === Key.Backslash ? shifted ? "|" : "\\"
			: key === Key.Comma ? shifted ? "<" : ","
			: key === Key.CloseBrace ? shifted ? "}" : "]"
			: key === Key.Equals ? shifted ? "+" : "="
			: key === Key.Hyphen ? shifted ? "_" : "-"
			: key === Key.OpenBrace ? shifted ? "{" : "["
			: key === Key.Period ? shifted ? ">" : "."
			: key === Key.Semicolon ? shifted ? ":" : ";"
			: key === Key.Slash ? shifted ? "?" : "/"
			: key === Key.Tab ? "\t"
			: key === Key.Tilde ? shifted ? "~" : "`"
			: key === Key.D0 ? shifted ? ")" : "0"
			: key === Key.D1 ? shifted ? "!" : "1"
			: key === Key.D2 ? shifted ? "@" : "2"
			: key === Key.D3 ? shifted ? "#" : "3"
			: key === Key.D4 ? shifted ? "$" : "4"
			: key === Key.D5 ? shifted ? "%" : "5"
			: key === Key.D6 ? shifted ? "^" : "6"
			: key === Key.D7 ? shifted ? "&" : "7"
			: key === Key.D8 ? shifted ? "*" : "8"
			: key === Key.D9 ? shifted ? "(" : "9"
			: key === Key.A ? shifted ? "A" : "a"
			: key === Key.B ? shifted ? "B" : "b"
			: key === Key.C ? shifted ? "C" : "c"
			: key === Key.D ? shifted ? "D" : "d"
			: key === Key.E ? shifted ? "E" : "e"
			: key === Key.F ? shifted ? "F" : "f"
			: key === Key.G ? shifted ? "G" : "g"
			: key === Key.H ? shifted ? "H" : "h"
			: key === Key.I ? shifted ? "I" : "i"
			: key === Key.J ? shifted ? "J" : "j"
			: key === Key.K ? shifted ? "K" : "k"
			: key === Key.L ? shifted ? "L" : "l"
			: key === Key.M ? shifted ? "M" : "m"
			: key === Key.N ? shifted ? "N" : "n"
			: key === Key.O ? shifted ? "O" : "o"
			: key === Key.P ? shifted ? "P" : "p"
			: key === Key.Q ? shifted ? "Q" : "q"
			: key === Key.R ? shifted ? "R" : "r"
			: key === Key.S ? shifted ? "S" : "s"
			: key === Key.T ? shifted ? "T" : "t"
			: key === Key.U ? shifted ? "U" : "u"
			: key === Key.V ? shifted ? "V" : "v"
			: key === Key.W ? shifted ? "W" : "w"
			: key === Key.X ? shifted ? "X" : "x"
			: key === Key.Y ? shifted ? "Y" : "y"
			: key === Key.Z ? shifted ? "Z" : "z"
			: "";
	}

	static clearQueue()
	{
		keyQueue.length = 0;
		charQueue.length = 0;
	}

	static getKey()
	{
		return keyQueue.pop() ?? null;
	}

	static getChar()
	{
		return charQueue.pop() ?? null;
	}

	static isPressed(key)
	{
		const index = Object.values(keyCode).indexOf(key)
		const keySpec = Object.keys(keyCode)[index]
		return keyStates[keySpec];
	}
}

export
class Mouse
{
	static get Default()
	{
		return this;
	}

	static get position()
	{
		return [ lastMouseX, lastMouseY ];
	}

	static get x()
	{
		return lastMouseX;
	}

	static get y()
	{
		return lastMouseY;
	}

	static clearQueue()
	{
		mouseQueue.length = 0;
	}

	static getEvent()
	{
		return mouseQueue.pop() ?? { key: null };
	}

	static isPressed(key)
	{
		return buttonStates[key] ?? false;
	}
}
