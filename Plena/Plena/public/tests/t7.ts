module t7 {
    var line: Grix
    var circle: Grix
    var ellipse: Grix
    var polygon: Grix
    var rect: Grix

    export function setup() {
        rect = new Grix()
            .rect(100, 100)
            .populate();
    }

    export function update(delta: number) {

    }

    export function render(delta: number) {
        rect.moveTo(100, 100)
        rect.scaleTo(2, 2)
        rect.render();
    }
}

Plena.init(t7.setup, t7.render, t7.update, 500, 500, [0.4, 0.8, 0.6, 1]);

//dice random
//clock
//pong
//random lines that are rotating