Plena.init(setup, render, update, 500, 500, [0.4, 0.8, 0.6, 1]);
var cat;
function setup() {
    cat = new Grix();
    cat.fromTexture(Plena.loadImg("cat.png"));
    cat.populate();
}
var rotate = 0;
function update() {
    rotate += 0.05;
}
function render() {
    cat.scaleToSize(15, 15);
    cat.setPivotMove(0.5, 0);
    cat.setPivotRot(250, 250, false);
    cat.moveTo(250, 0);
    cat.rotate(rotate);
    for (var i = 0; i < 50; i++) {
        cat.render();
        cat.rotate((Math.PI * 2) / 15);
        cat.move(0, 250 / 50);
    }
}
//# sourceMappingURL=t1.js.map