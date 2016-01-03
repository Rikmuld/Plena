module tIDK2 {
    var shape: ShapeGrix;

    export function setup() {
        shape = Grix.shape(DrawModes.LINES_STRIP).add([0, 0, 80, 0, 160, 80, 80, 80], [0, 1, 2, 2, 3, 0]).setColor(Color.White.ivory()).populate();
    }
    export function update(delta: number) {
        
    }
    export function render(delta: number) {
        shape.move(10, 10)
        shape.render();
    }
}

Plena.init(tIDK2.setup, tIDK2.render, tIDK2.update, 600, 600, Color.Brown.wheat());