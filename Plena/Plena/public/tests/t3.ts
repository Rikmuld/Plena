//module t3 {
//    var cat: SpriteGrix;
//    var animation = 0;
//    var x = 0;
//    var direction = 1;
//    var top = -1;
//    var cats = ["catBlack", "catBlue", "catOrange", "catWhite"]

//    export function setup() {
//        cat = Grix.fromSprite(Assets.loadSprite("cats.png")
//                .addAnimImgs(cats[0], 0, 5 * 32, 32, 32, 3)
//                .addAnimImgs(cats[1], 3 * 32, 5 * 32, 32, 32, 3)
//                .addAnimImgs(cats[2], 6 * 32, 5 * 32, 32, 32, 3)
//                .addAnimImgs(cats[3], 9 * 32, 5 * 32, 32, 32, 3))
//        Keyboard.addPressedEvent(switchMovement, Keyboard.KEY_SPACE)
//        Keyboard.addPressedEvent(switchTopDown, Keyboard.KEY_Q)
//    }

//    export function update(delta: number) {
//        animation += 0.1;
//        x += direction * 2;

//        if (x > Plena.getWidth()) x = -cat.getWidth();
//        if (x < -cat.getWidth()) x = Plena.getWidth();
//    }

//    export function render(delta: number) {
//        cat.setPivotMove(0, 0.5)
//        cat.scaleToSize(100, 100)
//        cat.moveTo(x, 50)
//        cat.mirrorHorizontal(direction == 1)
//        cat.mirrorVertical(top == 1)
//        cat.animeStep(Math.floor(animation))
//        cat.activeAnime(cats[direction == -1 ? top == 1 ? 1 : 3 : top == 1 ? 0 : 2])
//        cat.render();
//    }

//    function switchMovement() { direction *= -1; }
//    function switchTopDown() { top *= -1; }
//}

//Plena.init(t3.setup, t3.render, t3.update, 0, 200, window.innerWidth, 100, Color.Green.AQUAMARINE_MEDIUM);