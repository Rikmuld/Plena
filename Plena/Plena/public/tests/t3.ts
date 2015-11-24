module t3 {
    var cat:Grix;
    var animation = 0;
    var x = 0;
    var direction = 1;
    var cats = ["catBlack", "catBlue", "catOrange", "catWhite"]

    export function setup() {
        cat = new Grix()
            .animationFromSprite(Plena.loadSpriteFile("cats.png")
                .addAnimImgs(cats[0], 0, 5 * 32, 32, 32, 3)
                .addAnimImgs(cats[1], 3 * 32, 5 * 32, 32, 32, 3)
                .addAnimImgs(cats[2], 6 * 32, 5 * 32, 32, 32, 3)
                .addAnimImgs(cats[3], 9 * 32, 5 * 32, 32, 32, 3))
            .populate();
        Keyboard.addPressedEvent(Keyboard.KEY_SPACE, switchMovement)
    }

    export function update() {
        animation += 0.1;
        x += direction * 2;

        if (x > 500) x = -cat.getWidth();
        if (x < -cat.getWidth()) x = 500;
    }

    export function render() {
        cat.setPivotMove(0, 0.5)
        cat.scaleToSize(100, 100)
        cat.moveTo(x, 250)
        cat.mirrorHorizontal(direction==1)
        cat.animationStep(Math.floor(animation))
        cat.setActiveAnimation(cats[direction==-1?1:0])
        cat.render();
    }

    function switchMovement() {
        direction *= -1;
    }
}

Plena.init(t3.setup, t3.render, t3.update, 500, 500, [0.4, 0.8, 0.6, 1]);