var Mouse = (function () {
    function Mouse() {
    }
    Mouse.listenForPosition = function () {
        document.onmousemove = Mouse.mouseMoved;
    };
    Mouse.listenForClick = function () {
        document.body.onmouseup = Mouse.mouseUp;
        document.body.onmousedown = Mouse.mouseDown;
    };
    Mouse.listenForPositionCustom = function (mouseMoved) {
        document.onmousemove = mouseMoved;
    };
    Mouse.mouseMoved = function (event) {
        Mouse.mouseX = event.clientX;
        Mouse.mouseY = event.clientY;
    };
    Mouse.mouseUp = function (event) {
        Mouse.buttons[event.button] = false;
    };
    Mouse.mouseDown = function (event) {
        Mouse.buttons[event.button] = true;
    };
    Mouse.hide = function () {
        document.body.style.cursor = "none";
    };
    Mouse.show = function () {
        document.body.style.cursor = "auto";
    };
    Mouse.getX = function () {
        return Mouse.mouseX;
    };
    Mouse.getY = function () {
        return Mouse.mouseY;
    };
    Mouse.isButtonDown = function (button) {
        return Mouse.buttons[button];
    };
    Mouse.MOUSE_LEFT = 0;
    Mouse.MOUSE_RIGHT = 1;
    Mouse.MOUSE_MIDDLE = 2;
    Mouse.buttons = new Array(10);
    return Mouse;
})();
//key codes with keypressed
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.listenForKeysCustom = function (keyDown, keyUp) {
        document.onkeydown = keyDown;
        document.onkeyup = keyUp;
    };
    Keyboard.allowBrowserKeys = function (allow) {
        this.keysEnabled = allow;
    };
    Keyboard.listenForKeys = function () {
        document.onkeydown = Keyboard.keyDown;
        document.onkeyup = Keyboard.keyUp;
    };
    Keyboard.keyDown = function (event) {
        if (Keyboard.keyPressedCalls.contains(event.keyCode)) {
            var calls = Keyboard.keyPressedCalls.itterator(event.keyCode);
            for (var i = 0; i < calls.length; i++)
                if (!Keyboard.currentlyPressedKeys[event.keyCode])
                    calls[i](event);
        }
        Keyboard.currentlyPressedKeys[event.keyCode] = true;
        var calls = Keyboard.keyPressedCalls.itterator(-1);
        for (var i = 0; i < calls.length; i++)
            calls[i](event);
        return Keyboard.keysEnabled;
    };
    Keyboard.keyUp = function (event) {
        Keyboard.currentlyPressedKeys[event.keyCode] = false;
        if (Keyboard.keyReleasedCalls.contains(event.keyCode)) {
            var calls = Keyboard.keyReleasedCalls.itterator(event.keyCode);
            for (var i = 0; i < calls.length; i++)
                calls[i](event);
        }
        var calls = Keyboard.keyReleasedCalls.itterator(-1);
        for (var i = 0; i < calls.length; i++)
            calls[i](event);
    };
    Keyboard.isKeyDown = function (key) {
        return Keyboard.currentlyPressedKeys[key];
    };
    Keyboard.addReleasedEvent = function (callback) {
        var key = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            key[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < key.length; i++)
            Keyboard.keyReleasedCalls.put(key[i], callback);
        if (key.length == 0)
            Keyboard.keyReleasedCalls.put(-1, callback);
    };
    Keyboard.addPressedEvent = function (callback) {
        var key = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            key[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < key.length; i++)
            Keyboard.keyPressedCalls.put(key[i], callback);
        if (key.length == 0)
            Keyboard.keyPressedCalls.put(-1, callback);
    };
    Keyboard.currentlyPressedKeys = new Array(128);
    Keyboard.keyPressedCalls = new DeepTreeMap(NUMBER_COMPARE);
    Keyboard.keyReleasedCalls = new DeepTreeMap(NUMBER_COMPARE);
    Keyboard.keysEnabled = true;
    Keyboard.KEY_BACKSPACE = 8;
    Keyboard.KEY_TAB = 9;
    Keyboard.KEY_ENTER = 13;
    Keyboard.KEY_SHIFT = 16;
    Keyboard.KEY_CTRL = 17;
    Keyboard.KEY_ALT = 18;
    Keyboard.KEY_BREAK = 19;
    Keyboard.KEY_CAPS_LOCK = 20;
    Keyboard.KEY_ESCAPE = 27;
    Keyboard.KEY_SPACE = 32;
    Keyboard.KEY_PAGE_UP = 33;
    Keyboard.KEY_PAGE_DOWN = 34;
    Keyboard.KEY_END = 35;
    Keyboard.KEY_HOME = 36;
    Keyboard.KEY_LEFT = 37;
    Keyboard.KEY_UP = 38;
    Keyboard.KEY_RIGHT = 39;
    Keyboard.KEY_DOWN = 40;
    Keyboard.KEY_INSERT = 45;
    Keyboard.KEY_DELETE = 46;
    Keyboard.KEY_0 = 48;
    Keyboard.KEY_1 = 49;
    Keyboard.KEY_2 = 50;
    Keyboard.KEY_3 = 51;
    Keyboard.KEY_4 = 52;
    Keyboard.KEY_5 = 53;
    Keyboard.KEY_6 = 54;
    Keyboard.KEY_7 = 55;
    Keyboard.KEY_8 = 56;
    Keyboard.KEY_9 = 57;
    Keyboard.KEY_A = 65;
    Keyboard.KEY_B = 66;
    Keyboard.KEY_C = 67;
    Keyboard.KEY_D = 68;
    Keyboard.KEY_E = 69;
    Keyboard.KEY_F = 70;
    Keyboard.KEY_G = 71;
    Keyboard.KEY_H = 72;
    Keyboard.KEY_I = 73;
    Keyboard.KEY_J = 74;
    Keyboard.KEY_K = 75;
    Keyboard.KEY_L = 76;
    Keyboard.KEY_M = 77;
    Keyboard.KEY_N = 78;
    Keyboard.KEY_O = 79;
    Keyboard.KEY_P = 80;
    Keyboard.KEY_Q = 81;
    Keyboard.KEY_R = 82;
    Keyboard.KEY_S = 83;
    Keyboard.KEY_T = 84;
    Keyboard.KEY_U = 85;
    Keyboard.KEY_V = 86;
    Keyboard.KEY_W = 87;
    Keyboard.KEY_X = 88;
    Keyboard.KEY_Y = 89;
    Keyboard.KEY_Z = 90;
    Keyboard.KEY_WINDOWS_LEFT = 91;
    Keyboard.KEY_WINDOWS_RIGHT = 92;
    Keyboard.KEY_SELECT = 93;
    Keyboard.KEY_NUMPAD_0 = 96;
    Keyboard.KEY_NUMPAD_1 = 97;
    Keyboard.KEY_NUMPAD_2 = 98;
    Keyboard.KEY_NUMPAD_3 = 99;
    Keyboard.KEY_NUMPAD_4 = 100;
    Keyboard.KEY_NUMPAD_5 = 101;
    Keyboard.KEY_NUMPAD_6 = 102;
    Keyboard.KEY_NUMPAD_7 = 103;
    Keyboard.KEY_NUMPAD_8 = 104;
    Keyboard.KEY_NUMPAD_9 = 105;
    Keyboard.KEY_MULTIPLY = 106;
    Keyboard.KEY_ADD = 107;
    Keyboard.KEY_SUBSTRACT = 108;
    Keyboard.KEY_POINT = 109;
    Keyboard.KEY_DECIMAL_POINT = 110;
    Keyboard.DEVIDE = 111;
    Keyboard.KEY_F1 = 112;
    Keyboard.KEY_F2 = 113;
    Keyboard.KEY_F3 = 114;
    Keyboard.KEY_F4 = 115;
    Keyboard.KEY_F5 = 116;
    Keyboard.KEY_F6 = 117;
    Keyboard.KEY_F7 = 118;
    Keyboard.KEY_F8 = 119;
    Keyboard.KEY_F9 = 120;
    Keyboard.KEY_F10 = 121;
    Keyboard.KEY_F11 = 122;
    Keyboard.KEY_F12 = 123;
    Keyboard.KEY_NUM_LOCK = 144;
    Keyboard.KEY_SCROLL_LOCK = 145;
    Keyboard.KEY_SEMI_COLON = 186;
    Keyboard.KEY_EQUAL_SIGN = 187;
    Keyboard.KEY_COMMA = 188;
    Keyboard.KEY_DASH = 189;
    Keyboard.KEY_PERIOD = 190;
    Keyboard.KEY_SLASH_FORWARD = 191;
    Keyboard.KEY_GRAVE_ACCENT = 192;
    Keyboard.KEY_BRACKET_OPEN = 219;
    Keyboard.KEY_SLASH_BACK = 220;
    Keyboard.KEY_BRACKET_CLOSE = 221;
    Keyboard.KEY_QUOTE_SINGLE = 222;
    return Keyboard;
})();
//# sourceMappingURL=input.js.map