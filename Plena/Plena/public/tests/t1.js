var t1;
(function (t1) {
    var cat;
    var rotate = 0;
    var count = 1;
    function setup() {
        cat = new Grix()
            .fromTexture(Plena.loadImg("cat.png"))
            .populate();
        Keyboard.addPressedEvent(increseCount, Keyboard.KEY_SPACE);
    }
    t1.setup = setup;
    function update(delta) {
        rotate += 0.05;
    }
    t1.update = update;
    function render(delta) {
        var multiple = (Keyboard.isKeyDown(Keyboard.KEY_D)) ? 2 : 1;
        cat.scaleToSize(10, 10);
        cat.setPivotMove(0.5, 0);
        cat.setPivotRot(250, 250, false);
        cat.moveTo(250, 0);
        cat.rotate(rotate);
        for (var i = 0; i < 500 * multiple; i++) {
            cat.render();
            cat.rotate((Math.PI * 2) / count);
            cat.move(0, 250 / 500);
        }
    }
    t1.render = render;
    function increseCount() {
        count += 3 * Math.floor(count / 25) + 1;
    }
})(t1 || (t1 = {}));
Plena.init(t1.setup, t1.render, t1.update, 500, 500, [0.4, 0.8, 0.6, 1]);
//# sourceMappingURL=t1.js.map