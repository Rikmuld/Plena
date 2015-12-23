var t1;
(function (t1) {
    var cat;
    var rotate = 0;
    var SPEED_DIV = false;
    var SPEED = 3;
    var SPACE = 2;
    function setup() {
        cat = new ImgGrix();
        var catImg = Assets.loadImg("cat.png", Assets.NORMAL);
        for (var i = 0; i < 2500; i++) {
            if (i % SPACE == 0)
                cat.add(5, 5, catImg, (i % 50) * 10, Math.floor(i / 50) * 10);
        }
        cat.populate();
    }
    t1.setup = setup;
    function update(delta) {
        rotate += delta * 0.0005 * SPEED;
    }
    t1.update = update;
    function render(delta) {
        for (var i = 0; i < 20; i++) {
            cat.scaleToSize(600, 600);
            cat.setPivotMove(0.5, 0.5);
            cat.moveTo(250, 250);
            cat.rotateDeg(rotate * (SPEED_DIV ? i : 1));
            cat.render();
        }
    }
    t1.render = render;
})(t1 || (t1 = {}));
Plena.init(t1.setup, t1.render, t1.update, 500, 500, Color.Brown.WHEAT);
//# sourceMappingURL=t1.js.map