var t1;
(function (t1) {
    var cat;
    var rotate = 0;
    var count = 1;
    function setup() {
        cat = new Grix()
            .fromTexture(Assets.loadImg("cat.png", Assets.PIXEL_NORMAL))
            .populate();
        Keyboard.addPressedEvent(increseCount, Keyboard.KEY_SPACE);
    }
    t1.setup = setup;
    function update(delta) {
        rotate += 0.0025 * delta;
    }
    t1.update = update;
    function render(delta) {
        var multiple = (Keyboard.isDown(Keyboard.KEY_D)) ? 2 : 1;
        cat.scaleToSize(10, 10);
        cat.setPivotMove(0.5, 0);
        cat.setPivotRot(250, 250, false);
        cat.moveTo(250, 0);
        cat.rotate(rotate);
        var time = Date.now();
        for (var i = 0; i < 1000 * multiple; i++) {
            cat.render();
            cat.rotate((Math.PI * 2) / count);
            cat.move(0, 250 / 1000);
        }
    }
    t1.render = render;
    function increseCount() {
        count += 3 * Math.floor(count / 25) + 1;
    }
})(t1 || (t1 = {}));
Plena.init(t1.setup, t1.render, t1.update, 500, 500, new Color(255, 200, 175));
//# sourceMappingURL=t1.js.map