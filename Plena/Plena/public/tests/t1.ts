module t1 {
    var cat: Grix;
    var rotate: number = 0;
    var count: number = 1;

    export function setup() {
        cat = new Grix()
            .fromTexture(Plena.loadImg("cat.png"))
            .populate()
        Keyboard.addPressedEvent(Keyboard.KEY_SPACE, increseCount);
    }

    export function update() {
        rotate += 0.05;
    }

    export function render() {
        cat.scaleToSize(15, 15)
        cat.setPivotMove(0.5, 0)
        cat.setPivotRot(250, 250, false);
        cat.moveTo(250, 0)
        cat.rotate(rotate);
        for (var i = 0; i < 50; i++) {
            cat.render();
            cat.rotate((Math.PI * 2) / count);
            cat.move(0, 250 / 50)
        }
    }

    function increseCount() {
        count += Math.floor(count / 25) + 1;
    }
}

Plena.init(t1.setup, t1.render, t1.update, 500, 500, [0.4, 0.8, 0.6, 1]);