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

    static KEY_LEFT = 37
    static KEY_UP = 38
    static KEY_RIGHT = 39
    static KEY_DOWN = 40
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
    static KEY_RETURN = 13;
    static KEY_SPACE = 32;

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

    static addReleasedEvent(key: number, callback) {
        Keyboard.keyReleasedCalls.put(key, callback);
    }

    static addPressedEvent(key: number, callback) {
        Keyboard.keyPressedCalls.put(key, callback);
    }
}