const WIDTH = 63
const HEIGHT = 32
const SCALE = 1
const SPEED = 0.6

const GRAY = Color.mkColor(20, 20, 20)
const BLACK = Color.mkColor(200, 200, 200)
const BLUE = Color.mkColor(40, 80, 240)
const CROSS = Color.mkColor(50, 50, 50)

let run = -800 * SCALE
let animation: number = 0

let cross: ShapeGrix
let cell: ShapeGrix
let fade: ShapeGrix
let drawnGrid: WritableGrix

module Cell {
    class Progression {
        rulesValue: number[]

        constructor(rules: number[]) {
            this.rulesValue = rules
        }

        getInitalLine(i: number, j: number): number {
            if (i == Math.floor((WIDTH * SCALE - 1) / 2)) return 1
            return 0
        }
    }

    class SpacedProgression extends Progression {
        spacing: number

        constructor(rules: number[], spacing: number) {
            super(rules)
            this.spacing = spacing
        }

        getInitalLine(i: number, j: number): number {
            if (i % this.spacing == 0) return 1
            return 0
        }
    }

    class FreeProgression extends Progression {
        constructor(rules: number[], line: (i:number, j:number)=>number) {
            super(rules)
            this.getInitalLine = line
        }
    }

    let sideTriangles = new Progression([0, 0, 1, 1, 1, 1, 0, 0])
    let fractTriangle = new Progression([0, 1, 0, 1, 1, 0, 1, 0])
    let fullTriangle = new Progression([1, 1, 1, 1, 1, 0, 1, 0])
    let messyTriangle = new Progression([0, 0, 0, 1, 1, 1, 1, 0])

    let rules = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
        [1, 0, 0],
        [0, 1, 1],
        [0, 1, 0],
        [0, 0, 1],
        [0, 0, 0]
    ]

    let cells: number[] = []
    let config: Progression = fractTriangle //defines the progression

    export function getInitalLine(i: number, j: number): number {
        return config.getInitalLine(i, j)
    }
    export function calculateCell(i: number, j: number):number {
        var rul1 = (i - 1) >= 0 ? getCell(i - 1, j - 1) : 0
        var rul2 = getCell(i, j - 1)
        var rul3 = (i + 1) <= (WIDTH * SCALE - 1) ? getCell(i + 1, j - 1) : 0

        for (let rule = 0; rule < rules.length; rule++) {
            let value = getRule(rule)
            if (value[0] == rul1 && value[1] == rul2 && value[2] == rul3) {
                return config.rulesValue[rule]
            }
        }
    }

    export function getCell(i: number, j: number): number {
        return cells[i + j * WIDTH * SCALE]
    }
    export function setCell(i: number, j: number, value: number) {
        cells[i + j * WIDTH * SCALE] = value
    }
    export function getRule(i: number): number[] {
        return rules[i]
    }
    export function getRuleValue(i: number): number {
        return config.rulesValue[i]
    }
}

module IPlena {
    export function setup() {
        fade = Grix.shape().quad(1920, 1080).setColor(GRAY).populate()
        cell = Grix.shape().quad(25, 25).populate()

        cross = Grix.shape().setColor(CROSS).drawmode(gl.LINES)
        setupGrid()
        cross.populate()

        drawnGrid = Grix.writable(Assets.mkWritableImg(1920, 1080))
        drawnGrid.startWrite(Plena.getDefaultView())
        renderGrid()
        drawnGrid.endWrite()
    }

    export function update(delta: number) {
        if (run < 0) run += delta
        else animation += (animation>2500? SPEED:SPEED*2) * delta
    }

    export function render(delta: number) {
        drawnGrid.render()
        renderRules()

        Plena.forceRender()

        fade.moveTo(200, 155 + (12 / SCALE))
        let blob = 25 / SCALE

        let animationFade1 = (animation - 2500) / 10
        let animationFade2 = (((animation - 2500) / 10) % blob) * WIDTH * SCALE

        if (animation > 2500) {
            fade.move(0, Math.floor(animationFade1 / blob) * blob + blob)
        }

        fade.render()

        if (animation > 2500) {
            fade.clean()
            fade.moveTo(200, 155 + (12 / SCALE))
            fade.move(animationFade2, Math.floor(animationFade1 / blob) * blob)
            fade.render()
        }

        Plena.forceRender()
        cross.render()
        Plena.forceRender()

        if (animation < 3000) {
            fade.moveXTo(animation)
            fade.render()
        }
    }
}
Plena.init(IPlena.setup, IPlena.render, IPlena.update, 1920, 1080, GRAY)

function renderGrid() {
    cell.setPivotMove(0.5, 0.5)
    cell.scaleTo(1 / SCALE, 1 / SCALE)

    for (let i = 0; i < WIDTH * SCALE; i++) {
        for (let j = 0; j < HEIGHT * SCALE; j++) {
            setXY(i, j, false, cell)
            cell.setColor(getBulbColor(i, j))
            cell.render()
        }
    }
}

function renderRules() {
    cell.setPivotMove(0.5, 0.5)
    cell.scaleTo(1, 1)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 24; j++) {
            let index = Math.floor(j / 3)

            setXY(i - 7, j, true, cell)
            if (j % 3 == 0) {
                cell.setColor(getColor(Cell.getRule(index)[i]))
                cell.render()
            } else if (j % 3 == 1 && i % 2 == 1) {
                cell.setColor(getColor(Cell.getRuleValue(Math.floor(index))))
                cell.render()
            }
        }
    }
}

function setupGrid() {
    for (let j = 0; j < HEIGHT * SCALE; j++) {
        for (let i = 0; i < WIDTH * SCALE; i++) {
            Cell.setCell(i, j, (j == 0) ? Cell.getInitalLine(i, j) : Cell.calculateCell(i, j))
            if (SCALE == 1) {
                createCross(i + 7, j)
            }
            if (isRuleCoord(i, j)) createCross(i, j)
        }
    }
}
function isRuleCoord(i: number, j: number): boolean {
    return j < 24 && i < 3 && (j % 3 == 0 || j % 3 == 1 && i % 2 == 1)
}
function createCross(i: number, j: number) {
    let xOffset = 100 + i * 25
    let yOsset = 150 + j * 25

    cross.line(xOffset, 5 + yOsset, 10 + xOffset, 5 + yOsset)
    cross.line(5 + xOffset, yOsset, 5 + xOffset, 10 + yOsset)
}
function setXY(x: number, y: number, rule:boolean, grix: ShapeGrix) {
    grix.moveTo(280 + x * (rule? 25:(25 / SCALE)), 155 + y * (rule?25:(25 / SCALE)))
}
function getColor(i: number): Col {
    return i == 0 ? BLACK : BLUE
}
function getBulbColor(i: number, j: number): Col {
    return getColor(Cell.getCell(i, j))
}