//module t7 {
//    var block: ImgGrix
//    var clock: WritableGrix;
//    var timeStart = Date.now();

//    export function setup() {
//        let ctx = Assets.mkCanvas(100, 50);
//        ctx.fillRect(0, 0, 100, 50);
//        block = Grix.fromTexture(ctx);
//        clock = Grix.writable(Assets.mkWritableImg(Plena.width, Plena.height, true));

//        Plena.changeProjection(Plena.width * 3, Plena.height * 3)
//    }
//    export function update(delta: number) { }
//    export function render(delta: number) {
//        clock.startWrite();
//        renderClock();
//        clock.endWrite();

//        clock.scaleToSize(Plena.getWidth(), Plena.getHeight())
//        clock.render();
//        Plena.forceRender();

//        renderClock();

//        //clock.scaleToSize(200, 200)
//        //for (var i = 0; i < 12; i++) {
//        //    clock.moveTo((i % 3) * 220, Math.floor(i / 3) * 220)
//        //    clock.render();
//        //    clock.rotate(Math.PI/6)
//        //}
//    }

//    function renderClock() {
//        block.setPivotMove(0.5, 0.5);
//        block.moveTo(Mouse.getX(), Mouse.getY())
//        block.render();
//        block.moveTo(Mouse.getX(), Mouse.getY()-60)
//        block.render();
//        block.moveTo(Mouse.getX(), Mouse.getY()+60)
//        block.render();
//    }
//}

//Plena.init(t7.setup, t7.render, t7.update, Color.Orange.TOMATO);