module t2 {
    var marbles: SpriteGrix;
    var count: number = 0;
    var BLACK = "black";
    var WHITE = "white"

    export function setup() {
        marbles = Grix.fromSprite(Assets.loadSprite("marbles.jpg").addImgs([BLACK, WHITE], 0, 0, 100, 100, 2))
        Keyboard.addPressedEvent(increseCount, Keyboard.KEY_SPACE);
    }
    export function update(delta: number) { }
    export function render(delta: number) {
        for (var i = 0; i < count; i++) {
            marbles.moveTo((i % 5) * 100, 100 * Math.floor(i / 5));
            marbles.activeImg(Keyboard.isDown(Keyboard.KEY_I) ^ (i & 1) ? WHITE : BLACK);
            marbles.render();
        }
    }
    function increseCount() {
        if (count < 25) count++;
    }
}

Plena.init(t2.setup, t2.render, t2.update, 500, 500, Color.Purple.LAVENDAR);

//img grix whole board
//img grix with element id's indieces etc..