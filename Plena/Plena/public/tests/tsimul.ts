class Energy {
    private consumption: (time: number) => number
    count: number = 0
    private color: AColor;
    private width: number;
    private name: string;
    private locs:Vec2[] = []
    private graph: Graph

    constructor(name:string, color:AColor, width:number, energy: (time: number) => number) {
        this.consumption = energy
        this.color = color
        this.graph = new Graph(color, 120, 500)
        this.name = name;
        this.width = width;
    }

    getEnergy(ti:number = time): number {
        return this.consumption(ti) * this.count
    }

    add(loc: Vec2) {
        this.count++;
        this.locs.push(loc);

        solar.graph.reset();
        factory.graph.reset();
        city.graph.reset();
    }

    update() {
        this.graph.add([time * 25, -((400 / Energy.max()) * this.getEnergy())])
    }

    render() {
        this.graph.draw();

        machineGrix.clean();
        machineGrix.activeImg(this.name)
        machineGrix.scaleWidthToSize(this.width)
        machineGrix.setPivotMove(0.5, 0.5);
        for (let loc of this.locs) {
            machineGrix.moveTo(loc[0], loc[1])
            machineGrix.render()
        }
    }
}

namespace Energy {
    export function factoryE(time: number): number {
        return Math.max(0, city.getEnergy() - solar.getEnergy()) / factory.count
    }

    export function solarE(time: number): number {
        return Math.max(0, ((Math.sin(((time + 16) * Math.PI) / 12)) + 0.2) * 2)
    }

    export function cityE(time: number): number {
        return (Math.sin(((time + 6) * Math.PI) / 6) + 1) * 15 + 10
    }

    export function addEnergy(x: number, y: number, event: MouseEvent) {
        switch (curr) {
            case 0: solar.add([x, y]); break
            case 1: city.add([x, y]); break
            case 2: factory.add([x, y]); break
        }
    }

    export function max() {
        return Math.max(solar.getEnergy(14), city.getEnergy(9))
    }
}

class Graph {
    data:Vec2[] = []
    x: number
    y: number
    color: AColor

    constructor(color:AColor, x:number, y:number) {
        this.x = x
        this.y = y
        this.color = new AColor(color.color(), 0.8);
    }

    add(point: Vec2) {
        if (this.data.indexOf(point)==-1) this.data.push(point)
    }

    draw() {
        grix.setColor(this.color)
        grix.setPivotMove(0.5, 0.5)
        grix.scaleToSize(3, 3)
         
        for (let point of this.data) {
            grix.moveTo(this.x + point[0], this.y + point[1])
            grix.render()
        }
    }

    reset() {
        this.data = []
    }
}

module Textures {
    export const
        FACTORY = "fac",
        SOLAR = "solar",
        CITY = "city",
        TIME = "time"
}

var time: number = 0

var machineGrix: SpriteGrix;
var grix: ShapeGrix
var boxLine: ShapeGrix

var solar: Energy;
var city: Energy;
var factory: Energy;
var curr = 0;

var text: TextGrix;

function setup() {
    Plena.changeProjection(3840, 3840*(window.innerHeight / window.innerWidth))

    solar = new Energy(Textures.SOLAR, Color.Yellow.gold(1), 300, Energy.solarE)
    city = new Energy(Textures.CITY, Color.Blue.blueMidnight(1), 600, Energy.cityE)
    factory = new Energy(Textures.FACTORY, Color.Gray.graySlateDark(1), 400, Energy.factoryE)

    grix = new ShapeGrix(DrawModes.TRIANGLES).quad(100, 100).populate()
    boxLine = new ShapeGrix(DrawModes.LINES_LOOP).add([0, 0, 200, 0, 200, 50, 0, 50]).setColor(Color.White.white(1)).populate()

    machineGrix = Grix.fromSprite(Assets.loadSprite("machine.png", Assets.PIXEL_NORMAL)
        .addImg(Textures.FACTORY, 0, 0, 420, 420)
        .addImg(Textures.SOLAR, 420, 0, 420, 420)
        .addImg(Textures.CITY, 840, 0, 420, 420))

    text = new TextGrix(Assets.mkFontMap(new Font(Font.CENTURY_GOTHIC, 64).fill(Color.White.white(1)), Assets.LETTERS))

    Mouse.addReleasedEvent(Energy.addEnergy)
    Keyboard.addPressedEvent(function (event) {
        curr = 0
    }, Keyboard.KEY_1)
    Keyboard.addPressedEvent(function (event) {
        curr = 2
    }, Keyboard.KEY_3)
    Keyboard.addPressedEvent(function (event) {
        curr = 1
    }, Keyboard.KEY_2)

    Mouse.browserControll(false)
}
function update(delta: number) {
    solar.update();
    city.update();
    factory.update();

    time += delta * 0.001
    time = time % 24
}
function render(delta: number) {
    boxLine.scaleTo(3, 1)
    boxLine.moveTo(850, 200)
    boxLine.render()
    boxLine.move(0, 75)
    boxLine.render()
    boxLine.move(0, 75)
    boxLine.render()
    boxLine.clean();
    boxLine.moveTo(-1, -1)
    boxLine.scaleToSize(1760, 610)
    boxLine.render()
    grix.scaleToSize(1760, 610)
    grix.render()

    solar.render();
    city.render();
    factory.render();

    Plena.forceRender();

    grix.clean();
    grix.moveTo(850, 200)
    grix.setColor(Color.Yellow.gold(1))
    grix.scaleToSize((600 / Energy.max()) * solar.getEnergy(), 50)
    grix.render()

    grix.move(0, 75)
    grix.setColor(Color.Gray.graySlateDark(1))
    grix.scaleToSize((600 / Energy.max()) * factory.getEnergy(), 50)
    grix.render()

    grix.move(0, 75)
    grix.setColor(Color.Blue.blueMidnight(1))
    grix.scaleToSize((600 / Energy.max()) * city.getEnergy(), 50)
    grix.render()

    machineGrix.clean();
    machineGrix.scaleHeightToSize(50)
    machineGrix.moveTo(1485, 200)
    machineGrix.activeImg(Textures.SOLAR)
    machineGrix.render()
    machineGrix.move(0, 75)
    machineGrix.activeImg(Textures.FACTORY)
    machineGrix.render()
    machineGrix.move(0, 75)
    machineGrix.activeImg(Textures.CITY)
    machineGrix.render()

    machineGrix.clean();
    switch (curr) {
        case 0: machineGrix.activeImg(Textures.SOLAR); break
        case 1: machineGrix.activeImg(Textures.CITY); break
        case 2: machineGrix.activeImg(Textures.FACTORY); break
    }
    machineGrix.scaleWidthToSize(200)
    machineGrix.setPivotMove(1, 0)
    machineGrix.moveTo(Plena.getWidth() - 20, 20)
    machineGrix.render()

    Plena.forceRender()

    text.moveTo(850, 430)
    text.freeText("Time - "+Math.floor(time) + "h")
}

Plena.init(setup, render, update, new AColor(new Color(110, 175, 45), 1))
document.oncontextmenu = function () { return false; };