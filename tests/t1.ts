//module t1 {
//    var cat: ImgGrix;
//    var rotate = 0;

//    const SPEED_DIV = false;
//    const SPEED = 5;
//    const SPACE = 5;

//    export function setup() {
//        cat = new ImgGrix();
//        var catImg = Assets.loadImg("cat.png", Assets.NORMAL);
//        for (var i = 0; i < 5000; i++) {
//            if(i%SPACE==0)cat.add(5, 5, catImg, (i % 50) * 10, Math.floor(i / 50) * 10);
//        }
//        cat.populate();
//    }
//    export function update(delta: number) {
//        rotate += delta * 0.0005 * SPEED
//    }
//    export function render(delta: number) {
//        for (var i = 0; i < 20; i++){
//            cat.setPivotMove(0.5, 0.5)
//            cat.moveTo(Plena.getWidth()/2, Plena.getHeight()/2)
//            cat.rotateDeg(rotate * (SPEED_DIV? i:1))
//            cat.render();
//        }
//    }
//}
//Plena.init(t1.setup, t1.render, t1.update, Color.Brown.wheat(1));