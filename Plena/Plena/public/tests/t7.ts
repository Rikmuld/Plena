//module t7 {
//    var line: Grix
//    var circle: Grix
//    var clock: WritableGrix;
//    var timeStart = Date.now();

//    export function setup() {
//        circle = new Grix()
//            .circle(75)
//            .setColorV3([.85, .86, .87])
//            .populate();
//        line = new Grix()
//            .line(0, 75)
//            .setColorV3([.88, .89, .90])
//            .populate();
//        clock = new WritableGrix(Assets.mkWritableImg(500, 500, Assets.NORMAL));
//    }
//    export function update(delta: number) { }
//    export function render(delta: number) {
//        clock.startWrite();
//        renderClock();
//        clock.endWrite();
//        clock.scaleToSize(200, 200)
//        for (var i = 0; i < 12; i++) {
//            clock.moveTo((i % 3) * 220, Math.floor(i / 3) * 220)
//            clock.render();
//            clock.rotate(Math.PI/6)
//        }
//    }

//    function renderClock() {
//        circle.setPivotMove(.5, .5)
//        circle.moveTo(250, 250)
//        circle.render();
//        line.setPivotMove(.5, 0);
//        line.moveTo(250, 0)
//        line.setPivotRot(250, 250, false)
//        for (var i = 0; i < 12; i++) {
//            line.rotate((Math.PI * 2) / 12)
//            line.render();
//        }
//        line.clean();
//        line.scaleHeightToSize(250);
//        line.setPivotMove(0, 1);
//        line.moveTo(250, 250)
//        line.rotate(2 * Math.PI * ((Date.now() - timeStart) / 1000) / 60)
//        line.setPivotRot(0, 1)
//        line.render();
//    }
//}

//Plena.init(t7.setup, t7.render, t7.update, new Color(30, 30, 30));