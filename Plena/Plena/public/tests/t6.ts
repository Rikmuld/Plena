var score = 0;

module t6 {
    var bat: Grix
    var ball: Grix;

    var BALL_RADIUS = 20;
    var BAR_RADIUS = 60;
    var BALL_SPEED_INITAL = 5;
    var BALL_SPEED_INCRESE = .1;
    var BAR_SPEED_INITIAL = 10;

    var tt = 0;
    var x1;
    var x2;
    var xB;
    var yB;
    var direction: number;
    var v = BALL_SPEED_INITAL;
    var vb = BAR_SPEED_INITIAL;

    var isPlaying = false;

    export function setup() {
        bat = new Grix().colorRGB(100, 160, 100).rect(20, BAR_RADIUS * 2).populate();
        ball = new Grix().circle(BALL_RADIUS).colorRGB(255, 80, 100).populate();

        Keyboard.addPressedEvent(startBall, Keyboard.KEY_SPACE);
        Keyboard.addPressedEvent(end, Keyboard.KEY_ESCAPE);
        Mouse.hide();

        kill(false);
        score = 0
    }

    export function update(delta: number) {
        if (isPlaying) {
            v += BALL_SPEED_INCRESE / 60;
            vb += BALL_SPEED_INCRESE / 120;

            if (tt > 0) tt--;

            if (Keyboard.isKeyDown(Keyboard.KEY_W)) x1 -= vb;
            if (Keyboard.isKeyDown(Keyboard.KEY_S)) x1 += vb;
            if (Keyboard.isKeyDown(Keyboard.KEY_UP)) x2 -= vb;
            if (Keyboard.isKeyDown(Keyboard.KEY_DOWN)) x2 += vb;

            xB += v * Math.cos(direction);
            yB += v * Math.sin(direction);

            if (yB - BALL_RADIUS <= 0 || yB + BALL_RADIUS >= Plena.height) direction = Math.PI * 2 - direction;
            if (xB - BALL_RADIUS <= 0 || xB + BALL_RADIUS >= Plena.width) kill(xB - BALL_RADIUS <= 0);

            if (tt==0 && yB - BALL_RADIUS < x1 + BAR_RADIUS && yB + BALL_RADIUS > x1 - BAR_RADIUS && xB - BALL_RADIUS < 25 + 10) {
                direction = Math.PI - direction;
                direction += ((yB - x1) / BAR_RADIUS) * Math.PI / 4;
                tt = 5;
            }
            if (tt==0 && yB - BALL_RADIUS < x2 + BAR_RADIUS && yB + BALL_RADIUS > x2 - BAR_RADIUS && xB + BALL_RADIUS > Plena.width - (25 + 10)) {
                direction = Math.PI - direction;
                direction += ((x2 - yB) / BAR_RADIUS) * Math.PI / 4;
                tt = 5;
            }

            if (x1 < BAR_RADIUS) x1 = BAR_RADIUS;
            if (x1 > Plena.height - BAR_RADIUS) x1 = Plena.height - BAR_RADIUS;
            if (x2 < BAR_RADIUS) x2 = BAR_RADIUS;
            if (x2 > Plena.height - BAR_RADIUS) x2 = Plena.height - BAR_RADIUS;
        }
    }

    function end() {
        kill(false)
        score = 0;
    }

    function kill(left: boolean) {
        xB = Plena.width / 2;
        yB = Plena.height / 2;
        x1 = Plena.height / 2;
        x2 = Plena.height / 2;

        isPlaying = false;
        score += left ? 1 : -1;

        if (Math.abs(score) == 5) {
            score = 0;
            v = BALL_SPEED_INITAL;
            vb = BAR_SPEED_INITIAL;
        }
    }

    export function render(delta: number) {
        GLF.clearColor([.15, .15, .15, 1])  

        if (score > 0) bat.colorRGB(100 + score * 40, 160 - score * 20, 100);
        else bat.colorRGB(100 + score * 40, 160 + score * 10, 100 - score * 50);
        bat.setPivotMove(0.5, 0.5)
        bat.moveTo(25, x1)
        bat.render();
        if (score < 0) bat.colorRGB(100 - score * 40, 160 + score * 20, 100);
        else bat.colorRGB(100 - score * 40, 160 - score * 10, 100 + score * 50);
        bat.moveTo(window.innerWidth - 25, x2);
        bat.render();

        ball.setPivotMove(0.5, 0.5)
        ball.moveTo(xB, yB)
        ball.render()
    }

    function startBall() {
        if (!isPlaying) {
            direction = Math.floor(Math.random()*2) * Math.PI;
            isPlaying = true;
        }
    }
}

Plena.init(t6.setup, t6.render, t6.update);