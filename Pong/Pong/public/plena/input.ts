class Mouse {
    static MOUSE_LEFT = 0
    static MOUSE_RIGHT = 1
    static MOUSE_MIDDLE = 2

    private static mouseX: number;
    private static mouseY: number;
    private static buttons: boolean[] = new Array(10);

    static listenForPosition() {
        document.onmousemove = Mouse.mouseMoved;
    }

    static listenForClick() {
        document.body.onmouseup = Mouse.mouseUp;
        document.body.onmousedown = Mouse.mouseDown;
    }

    static listenForPositionCustom(mouseMoved) {
        document.onmousemove = mouseMoved;
    }

    private static mouseMoved(event) {
        Mouse.mouseX = event.clientX;
        Mouse.mouseY = event.clientY;
    }

    private static mouseUp(event) {
        Mouse.buttons[event.button] = false;
    }

    private static mouseDown(event) {
        Mouse.buttons[event.button] = true;
    }

    static hide() {
        document.body.style.cursor = "none";
    }

    static show() {
        document.body.style.cursor = "auto"
    }

    static getX() {
        return Mouse.mouseX;
    }

    static getY() {
        return Mouse.mouseY;
    }

    static isButtonDown(button: number) {
        return Mouse.buttons[button];
    }
}

class Keyboard {
    private static currentlyPressedKeys = new Array(128);
    private static keyPressedCalls = new DeepTreeMap<number, () => void>(NUMBER_COMPARE);
    private static keyReleasedCalls = new DeepTreeMap<number, () => void>(NUMBER_COMPARE);

    static KEY_BACKSPACE = 8;
    static KEY_TAB = 9;
    static KEY_ENTER = 13;
    static KEY_SHIFT = 16;
    static KEY_CTRL = 17;
    static KEY_ALT = 18;
    static KEY_BREAK = 19;
    static KEY_CAPS_LOCK = 20;
    static KEY_ESCAPE = 27;
    static KEY_SPACE = 32;
    static KEY_PAGE_UP = 33;
    static KEY_PAGE_DOWN = 34;
    static KEY_END = 35;
    static KEY_HOME = 36;
    static KEY_LEFT = 37
    static KEY_UP = 38
    static KEY_RIGHT = 39
    static KEY_DOWN = 40
    static KEY_INSERT = 45;
    static KEY_DELETE = 46;
    static KEY_0 = 48;
    static KEY_1 = 49;
    static KEY_2 = 50;
    static KEY_3 = 51;
    static KEY_4 = 52;
    static KEY_5 = 53;
    static KEY_6 = 54;
    static KEY_7 = 55;
    static KEY_8 = 56;
    static KEY_9 = 57;
    static KEY_A = 65;
    static KEY_B = 66;
    static KEY_C = 67;
    static KEY_D = 68;
    static KEY_E = 69;
    static KEY_F = 70;
    static KEY_G = 71;
    static KEY_H = 72;
    static KEY_I = 73;
    static KEY_J = 74;
    static KEY_K = 75;
    static KEY_L = 76;
    static KEY_M = 77;
    static KEY_N = 78;
    static KEY_O = 79;
    static KEY_P = 80;
    static KEY_Q = 81;
    static KEY_R = 82;
    static KEY_S = 83;
    static KEY_T = 84;
    static KEY_U = 85;
    static KEY_V = 86;
    static KEY_W = 87;
    static KEY_X = 88;
    static KEY_Y = 89;
    static KEY_Z = 90;
    static KEY_WINDOWS_LEFT = 91;
    static KEY_WINDOWS_RIGHT = 92;
    static KEY_SELECT = 93;
    static KEY_NUMPAD_0 = 96;
    static KEY_NUMPAD_1 = 97;
    static KEY_NUMPAD_2 = 98;
    static KEY_NUMPAD_3 = 99;
    static KEY_NUMPAD_4 = 100;
    static KEY_NUMPAD_5 = 101;
    static KEY_NUMPAD_6 = 102;
    static KEY_NUMPAD_7 = 103;
    static KEY_NUMPAD_8 = 104;
    static KEY_NUMPAD_9 = 105;
    static KEY_MULTIPLY = 106;
    static KEY_ADD = 107;
    static KEY_SUBSTRACT = 108;
    static KEY_POINT = 109;
    static KEY_DECIMAL_POINT = 110;
    static DEVIDE = 111;
    static KEY_F1 = 112
    static KEY_F2 = 113
    static KEY_F3 = 114
    static KEY_F4 = 115
    static KEY_F5 = 116
    static KEY_F6 = 117
    static KEY_F7 = 118
    static KEY_F8 = 119
    static KEY_F9 = 120
    static KEY_F10 = 121
    static KEY_F11 = 122
    static KEY_F12 = 123
    static KEY_NUM_LOCK = 144
    static KEY_SCROLL_LOCK = 145
    static KEY_SEMI_COLON = 186
    static KEY_EQUAL_SIGN = 187
    static KEY_COMMA = 188
    static KEY_DASH = 189
    static KEY_PERIOD = 190
    static KEY_SLASH_FORWARD = 191
    static KEY_GRAVE_ACCENT = 192
    static KEY_BRACKET_OPEN = 219
    static KEY_SLASH_BACK = 220
    static KEY_BRACKET_CLOSE = 221
    static KEY_QUOTE_SINGLE = 222

    static listenForKeysCustom(keyDown, keyUp) {
        document.onkeydown = keyDown;
        document.onkeyup = keyUp;
    }

    static listenForKeys() {
        document.onkeydown = Keyboard.keyDown;
        document.onkeyup = Keyboard.keyUp;
    }

    private static keyDown(event) {
        if (Keyboard.keyPressedCalls.contains(event.keyCode)) {
            var calls = Keyboard.keyPressedCalls.itterator(event.keyCode);
            for (var i = 0; i < calls.length; i++)if(!Keyboard.currentlyPressedKeys[event.keyCode])calls[i]();
        }
        Keyboard.currentlyPressedKeys[event.keyCode] = true;
    }

    private static keyUp(event) {
        Keyboard.currentlyPressedKeys[event.keyCode] = false;
        if (Keyboard.keyReleasedCalls.contains(event.keyCode)) {
            var calls = Keyboard.keyReleasedCalls.itterator(event.keyCode);
            for (var i = 0; i < calls.length; i++)calls[i]();
        }
    }

    static isKeyDown(key:number) {
        return Keyboard.currentlyPressedKeys[key];
    }

    static addReleasedEvent(callback, ...key: number[]) {
        for (var i = 0; i < key.length; i++)Keyboard.keyReleasedCalls.put(key[i], callback);
    }

    static addPressedEvent(callback, ...key: number[]) {
        for (var i = 0; i < key.length; i++)Keyboard.keyPressedCalls.put(key[i], callback);
    }
}