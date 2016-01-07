//module t10 {
//    var cloudy: ImgGrix;
//    var preText: ImgGrix;
//    var mouseText: ImgGrix;
//    var cloudCount: TextGrix;
//    var cloudPos: TextGrix;
//    var calibri = Assets.getFont(Font.CALIBRI, 120).fill(Color.Gray.BLACK).stroke(Color.Green.GREEN);
//    var lobster = Assets.getFont("lobster", 120).fill(Color.Gray.BLACK);
//    var clouds: ImgGrix[] = [];
//    var cloudsCoords: Vec2[] = [];
//    var ready:Vec2;
//    export function setup() {
//        var ctx = Assets.mkCanvas(360, 200);
//        createCloud(ctx)
//        cloudy = Grix.fromTexture(ctx, Assets.NORMAL)
//        preText = Grix.text("Pre created text rocks the whole new world!! Doesn't it?", calibri.align("right"), Assets.LETTERS, 1750, 0);
//        mouseText = Grix.text("The Mouse is here!", lobster.align("center").fill(Color.Red.CRIMSON), Assets.LETTERS);
//        cloudCount = Grix.fromFontMap(Assets.mkFontMap(lobster, Assets.LETTERS, FontMap.BASIC_KEYS, 2));
//        cloudPos = Grix.fromFontMap(Assets.mkFontMap(calibri.fill(Color.Gray.BLACK).stroke(Color.Gray.BLACK).size(48)));
//        Mouse.addPressedEvent(addCloud, Mouse.LEFT);
//        Mouse.hide();
//        Plena.changeProjection(Plena.width * 3, Plena.height * 3)
//    }
//    export function update(delta: number) { }
//    export function render(delta: number) {
//        let col = Color.Blue.BLUE_SKY.vec();
//        gl.clearColor(col[0], col[1], col[2], 1)
//        gl.clear(gl.COLOR_BUFFER_BIT)
//        for (let i = 0; i < cloudsCoords.length; i++) {
//            let coords = cloudsCoords[i]
//            let cloud = clouds[i];
//            cloud.setPivotMove(0.5, 0.5);
//            cloud.moveTo(coords[0], coords[1]);
//            cloud.render();
//        }
//        Plena.forceRender()
//        let writable: WritableGrix;
//        if (ready) {
//            cloudy.setPivotMove(0.5, 0.5)
//            cloudPos.setPivotMove(0.5, 0.5)
//            cloudy.moveTo(Mouse.getX(), Mouse.getY())
//            cloudy.render();
//            cloudPos.moveTo(Mouse.getX(), Mouse.getY())
//            cloudPos.freeText(`${Mouse.getX()}, ${Mouse.getY()}`);
//            Plena.forceRender()
//            writable = Grix.writable(Assets.mkWritableImg(500, 200, false, Assets.NORMAL))
//            writable.setPivotWirte(0.5, 0.5)
//            writable.moveWirteTo(Mouse.getX(), Mouse.getY())
//            writable.setBackground(Color.White.WHITE, 0)
//            writable.startWrite();
//        }
//        cloudy.setPivotMove(0.5, 0.5)
//        cloudPos.setPivotMove(0.5, 0.5)
//        cloudy.moveTo(Mouse.getX(), Mouse.getY())
//        cloudy.render();
//        cloudPos.moveTo(Mouse.getX()-100, Mouse.getY()-24)
//        cloudPos.freeText(`${Mouse.getX()}, ${Mouse.getY()}`);
//        if (ready) {
//            writable.endWrite();
//            cloudsCoords.push(ready);
//            clouds.push(Grix.fromTexture(writable.getImg()))
//            ready = null;
//        }
//        preText.setPivotMove(1, 0)
//        preText.moveTo(Plena.getWidth() - 50, 50)
//        preText.render();
//        mouseText.setPivotMove(0.5, 0.5)
//        mouseText.moveTo(Mouse.getX(), Mouse.getY()-100)
//        mouseText.render();
//        cloudCount.fontsize(64);
//        cloudCount.moveTo(50, 50)
//        cloudCount.freeText(`Current amount of clouds: ${clouds.length + 1} (mutable text btw)`, 800)
//    }
//    function createCloud(ctx: CanvasRenderingContext2D) {
//        ctx.beginPath();
//        ctx.moveTo(70, 80);
//        ctx.bezierCurveTo(30, 100, 30, 150, 130, 150);
//        ctx.bezierCurveTo(150, 180, 220, 180, 240, 150);
//        ctx.bezierCurveTo(320, 150, 320, 120, 290, 100);
//        ctx.bezierCurveTo(330, 40, 270, 30, 240, 50);
//        ctx.bezierCurveTo(220, 5, 150, 20, 150, 50);
//        ctx.bezierCurveTo(100, 5, 50, 20, 70, 80);
//        ctx.closePath();
//        ctx.fillStyle = new Color(240, 240, 240).style();
//        ctx.fill();
//    }
//    function addCloud(x:number, y:number, event: MouseEvent) {
//        ready = [x, y];
//    }
//}
//Plena.init(t10.setup, t10.render, t10.update, Color.Blue.BLUE_SKY); 
//# sourceMappingURL=t91.js.map