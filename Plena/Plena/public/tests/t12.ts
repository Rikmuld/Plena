module tIDK2 {
    var shape: ImgGrix;

    export function setup() {
        let cat = Assets.loadImg("cat.png", Assets.BACKGROUND)
        cat.onLoaded(function () {
            alert(cat.getWidth())
            shape = new ImgGrix().add(600, 600, cat, 0, 0, cat.getCoord().newCoords(cat, 600, 600)).populate()
        })
    }
    export function update(delta: number) {
        
    }
    export function render(delta: number) {
        shape.render();
    }
}

Plena.init(tIDK2.setup, tIDK2.render, tIDK2.update, 600, 600, Color.Brown.wheat());