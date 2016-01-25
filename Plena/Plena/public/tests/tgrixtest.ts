//Shape grix and writable grix example

module t100 {
    var flow: WritableGrix;
    var recorder: ShapeGrix;
    var screen: WritableGrix;
    var mouse: ShapeGrix;
    var rotate = 0;

    var mode = 0;

    var world: Views.View;
    var HUD: Views.View;

    export function setup() {
        world = Views.createView();
        world.fixedResolutionH(1080);

        HUD = Views.createView();
        Mouse.hide()

        let shape = new ShapeGrix()
            .drawmodes([2, 2, 2, 4, 1])

            .quad(150, 250)
            .quad(100, 100)
            .quad(50, 210, 50, 20, 1)
            .quad(100, 100, 50, 150, 2)
            .quad(40, 40, 55, 105, 3);

        for (var i = 0; i < 50; i++) {
            shape.line(0, 45 + i * 5, 150, 105 + i * 5, 4);
        }

        shape
            .setColor(Color.White.AZURE)
            .populate();

        recorder = new ShapeGrix().drawmode(2).quad(80, 45).populate();
        let lcd = Assets.mkWritableImg(80, 45, 0, 0, 1920, 1080, Assets.NORMAL)
        screen = new WritableGrix(lcd).add(160, 90, lcd.getImg()).populate() as WritableGrix

        mouse = Grix.shape().drawmode(6, 0).circle(15).setColor(Color.White.AZURE).populate();

        let writable = Assets.mkWritableImg(400, 400, world.getWidth() / 2 - 200, world.getHeight() / 2 - 200, 1200, 1200, Assets.NORMAL)
        flow = new WritableGrix(writable).add(300, 300, writable.getImg()).populate() as WritableGrix
        flow.setBackground(new AColor(0, 0, 0, 0));
        flow.startWrite(world)
        shape.setPivotMove(0.5, 0.5)
        shape.moveTo(world.getWidth() / 2, world.getHeight() / 2)

        for (var i = 0; i < 10; i++) {
            shape.rotate(Math.PI / 5)
            shape.render();
        }
        flow.endWrite()

        Mouse.addPressedEvent(flipMode, Mouse.LEFT)
    }
    export function update(delta: number) {
        rotate += 0.0015 * delta;
    }
    export function render(delta: number) {
        world.view();
        drawScreen();

        screen.setPivotWirte(0.5, 0.5);
        screen.moveWirteTo(Mouse.getX(world), Mouse.getY(world))
        if (mode == 0) screen.setBackground(Color.Gray.BLACK)
        else screen.setBackground(new AColor(0, 0, 0, 0))
        screen.startWrite(world);
        drawScreen();
        screen.endWrite();

        screen.setPivotMove(0.5, 0.5)
        screen.scaleToSize(640, 360)
        screen.moveTo(world.getWidth() / 2, world.getHeight() / 2)
        screen.render();
        Plena.forceRender();

        recorder.setPivotMove(0.5, 0.5)
        if (mode == -1) {
            recorder.moveTo(Mouse.getX(world), Mouse.getY(world))
            recorder.render()
        }
        recorder.scaleTo(8, 8)
        recorder.moveTo(world.getWidth() / 2, world.getHeight() / 2)
        recorder.render()

        if (mode == 0) {
            HUD.view()
            mouse.setPivotMove(0.5, 0.5)
            if (Math.floor(rotate) % 2 == 1) mouse.setColor(Color.Red.CRIMSON);
            mouse.scaleHeightToSize(15)
            mouse.moveTo(Mouse.getX(HUD), Mouse.getY(HUD))
            mouse.render()
        }
    }
    function drawScreen() {
        flow.rotate(rotate)
        flow.setPivotMove(0.5, 0.5)
        flow.scaleToSize(250, 250)
        flow.moveTo(150, 150)
        flow.render()
        flow.moveTo(world.getWidth() - 150, 150)
        flow.render()
        flow.moveTo(150, world.getHeight() - 150)
        flow.render()
        flow.moveTo(world.getWidth() - 150, world.getHeight() - 150)
        flow.render()
    }
    function flipMode(event: MouseEvent) {
        mode = ~mode
    }
}
Plena.init(t100.setup, t100.render, t100.update, Color.Cyan.TEAL)