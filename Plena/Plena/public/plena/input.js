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
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.listenForKeysCustom = function (keyDown, keyUp) {
        document.onkeydown = keyDown;
        document.onkeyup = keyUp;
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
                    calls[i]();
        }
        Keyboard.currentlyPressedKeys[event.keyCode] = true;
    };
    Keyboard.keyUp = function (event) {
        Keyboard.currentlyPressedKeys[event.keyCode] = false;
        if (Keyboard.keyReleasedCalls.contains(event.keyCode)) {
            var calls = Keyboard.keyReleasedCalls.itterator(event.keyCode);
            for (var i = 0; i < calls.length; i++)
                calls[i]();
        }
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
    };
    Keyboard.addPressedEvent = function (callback) {
        var key = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            key[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < key.length; i++)
            Keyboard.keyPressedCalls.put(key[i], callback);
    };
    Keyboard.currentlyPressedKeys = new Array(128);
    Keyboard.keyPressedCalls = new DeepTreeMap(NUMBER_COMPARE);
    Keyboard.keyReleasedCalls = new DeepTreeMap(NUMBER_COMPARE);
    Keyboard.KEY_LEFT = 37;
    Keyboard.KEY_UP = 38;
    Keyboard.KEY_RIGHT = 39;
    Keyboard.KEY_DOWN = 40;
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
    Keyboard.KEY_RETURN = 13;
    Keyboard.KEY_SPACE = 32;
    return Keyboard;
})();
//# sourceMappingURL=input.js.map