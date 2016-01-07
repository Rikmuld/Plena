module tIDK {
    var shape: ShapeGrix;
    var tri: WritableGrix;
    var rotate: number = 0;

    export function setup() {
        shape = Grix.shape(gl.TRIANGLES).point(0, 0).point(80, 0).point(40, 80).setColor(Color.White.ivory()).populate();
        tri = Grix.writable(Assets.mkWritableImg(Plena.getWidth(), Plena.getHeight()))
    }
    export function update(delta: number) {
        console.log(Plena.getWidth())
        rotate += delta * 0.05;
    }
    export function render(delta: number) {
        tri.startWrite();
        shape.rotateDeg(rotate);
        renderLine(shape, 7, 7, 1, 1);
        shape.rotateDeg(180)
        shape.setColor(Color.White.linen())
        renderLine(shape, 6, 6, 1, 1, 0, -40);
        tri.endWrite();

        let rot = ((rotate / 200) % 2);
        if (rot > 1) rot = 1-rot%1;

        tri.scaleTo((rot+0.1)/1.3, (rot+0.1)/1.3)
        tri.setPivotMove(0.5, 0.5)
        tri.moveTo(300, 300);
        tri.rotateToDeg(rotate);
        tri.render();
    }
    function renderLine(shape:ShapeGrix, max: number, baseMax:number, curr: number, basis:number, x:number = 0, y:number = 0) {
        shape.setPivotMove(0.5, 0.5);
        shape.moveTo(x + Plena.getWidth() / 2 - 40 * (basis - 1) + 80 * (curr - 1), y + Plena.getHeight()/2 + max * 80 - (baseMax+1) * 40);
        shape.render();
        if (curr == basis && max > 1) renderLine(shape, max - 1, baseMax, 1, basis + 1, x, y);
        else if (curr < basis) renderLine(shape, max, baseMax, curr + 1, basis, x, y);
    }
}

Plena.init(tIDK.setup, tIDK.render, tIDK.update, 600, 600, Color.Brown.wheat());