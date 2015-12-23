//module t10 {
//    var cloudy: Grix;
//    var preText: Grix;
//    var mouseText: Grix;
//    var cloudCount: TextGrix;
//    var cloudPos: TextGrix;

//    var calibri = Assets.getFont(Font.CALIBRI, 120).fill(Color.Gray.BLACK).stroke(Color.Green.GREEN);
//    var lobster = Assets.getFont("lobster", 120).fill(Color.Gray.BLACK);

//    var clouds: Vec2[] = [];

//    export function setup() {
//        var ctx = Assets.mkCanvas(360, 200);
//        createCloud(ctx)

//        cloudy = new Grix().fromCanvas(ctx, Assets.NORMAL).populate();
//        preText = TextGrix.text("Pre created text rocks the whole new world!! Doesn't it?", calibri.align("right"), Assets.LETTERS, 1750, 0);
//        mouseText = TextGrix.text("The Mouse is here!", lobster.align("center").fill(Color.Red.CRIMSON), Assets.LETTERS);
//        cloudCount = new TextGrix(Assets.mkFontMap(lobster, Assets.LETTERS, FontMap.BASIC_KEYS, 2));
//        cloudPos = new TextGrix(Assets.mkFontMap(calibri.fill(Color.Gray.BLACK).stroke(Color.Gray.BLACK).size(48)));

//        Mouse.addPressedEvent(addCloud, Mouse.LEFT);
//        Mouse.hide();

//        Plena.changeProjection(Plena.width * 3, Plena.height * 3)
//    }
//    export function update(delta: number) { }
//    export function render(delta: number) {
//        cloudy.setPivotMove(0.5, 0.5)
//        cloudPos.setPivotMove(0.5, 0.5)

//        for (let cloud of clouds) {
//            cloudy.moveTo(cloud[0], cloud[1])
//            cloudy.render();
//            cloudPos.moveTo(cloud[0], cloud[1])
//            cloudPos.freeText(`${cloud[0]}, ${cloud[1]}`);
//        }

//        cloudy.moveTo(Mouse.getX(), Mouse.getY())
//        cloudy.render();
//        cloudPos.moveTo(Mouse.getX(), Mouse.getY())
//        cloudPos.freeText(`${Mouse.getX()}, ${Mouse.getY()}`);

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
//        clouds.push([x, y]);
//    }
//}

//Plena.init(t10.setup, t10.render, t10.update, Color.Blue.BLUE_SKY);