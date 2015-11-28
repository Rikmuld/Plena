module t5 {
    var colors: Grix;
    var color: Vec3[] = [];

    var seed = 31984715;
    var deviation = 20 / 256;

    export function setup() {
        MMath.setRandomSeed(seed);

        randomColors();
        colors = new Grix()
            .rect(960, 560)
            .populate();

        Keyboard.addPressedEvent(randomColors, Keyboard.KEY_SPACE)
    }

    export function update(delta: number) {
        
    }

    export function render(delta: number) {
        GLF.clearColor([color[0][0], color[0][1], color[0][2], 1])

        colors.setColorV3([1, 1, 1])
        colors.setPivotMove(0.5, 0.5);
        colors.moveTo(1920, 1080);
        colors.render();
        colors.clean()
        colors.setPivotMove(0, 0);
        colors.scaleToSize(320, 160);
        colors.moveTo(1520, 880)
        for (var i = 0; i < 4; i++) {
            colors.setColorV3(color[i])
            colors.render();
            if(i == 0)colors.move(0, 3*80)
            if (i == 1) colors.move(6 * 80, 0)
            if (i == 2) colors.move(0, -3*80)
        }
    }

    function randomColors() {
        color[0] = [0, 0, 0];
        for (var i = 0; i < 3; i++) color[0][i] = MMath.random();
        for (var j = 1; j < 4; j++) {
            color[j] = [];
            for (var i = 0; i < 3; i++) color[j][i] = color[0][i] - deviation + MMath.random() * deviation*2;
        }
    }
}

Plena.init(t5.setup, t5.render, t5.update, 3840, 2160, [1, 1, 1, 1]);