module t10 {
    var calibri = Plena.font(Font.CENTURY_GOTHIC, 64).fill(100, 0, 200, 1);
    var text: TextGrix

    var str = "";

    export function setup() {
        text = new TextGrix(Plena.fontMap(calibri, true, true));

        Keyboard.addPressedEvent(keyPressed);
        Keyboard.allowBrowserKeys(false);
    }

    function keyPressed(event) {
        var char = String.fromCharCode(event.keyCode);
        if (char.length > 0 && /^[a-z0-9 ]+$/i.test(char)) str += String.fromCharCode(event.keyCode);
        if (event.keyCode == Keyboard.KEY_BACKSPACE) str = str.slice(0, str.length-1)
    }

    export function update(delta: number) {}
    export function render(delta: number) {
        text.text(str, 500);
    }
}

Plena.init(t10.setup, t10.render, t10.update, 500, 500, [0, 0, 0, 1]);