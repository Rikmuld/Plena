const WIDTH = 61
const HEIGHT = 31
const SCALE = 1

const GRAY = Color.mkColor(180, 180, 180)
const BLACK = Color.mkColor(80, 80, 80)
const BLUE = Color.mkColor(48, 128, 255)

let run = -1000
let animation: number = 0

let cross: ShapeGrix
let cell: ShapeGrix
let fade: ShapeGrix

module Cell {
    module SideTriangles {
        export let rulesValue = [0, 0, 1, 1, 1, 1, 0, 0]

        export function getInitalLine(i: number, j: number): number {
            if (i % 17 == 0) return 1
            return 0
        }
    }

    module FractTriangle {
        export let rulesValue = [0, 1, 0, 1, 1, 0, 1, 0]

        export function getInitalLine(i: number, j: number): number {
            if (i == 30) return 1
            return 0
        }
    }

    module FullTriangle {
        export let rulesValue = [1, 1, 1, 1, 1, 0, 1, 0]

        export function getInitalLine(i: number, j: number): number {
            if (i == 30) return 1
            return 0
        }
    }

    module MessyTriangle {
        export let rulesValue = [0, 0, 0, 1, 1, 1, 1, 0]

        export function getInitalLine(i: number, j: number): number {
            if (i == 30) return 1
            return 0
        }
    }

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
    let config = FractTriangle //defines the progression

    export function getInitalLine(i: number, j: number): number {
        return config.getInitalLine(i, j)
    }
    export function calculateCell(i: number, j: number):number {
        var rul1 = (i - 1) >= 0 ? getCell(i - 1, j - 1) : 0
        var rul2 = getCell(i, j - 1)
        var rul3 = (i + 1) <= (WIDTH - 1) ? getCell(i + 1, j - 1) : 0

        for (let rule = 0; rule < rules.length; rule++) {
            let value = getRule(rule)
            if (value[0] == rul1 && value[1] == rul2 && value[2] == rul3) {
                return config.rulesValue[rule]
            }
        }
    }

    export function getCell(i: number, j: number): number {
        return cells[i + j * WIDTH]
    }
    export function setCell(i: number, j: number, value: number) {
        cells[i + j * WIDTH] = value
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

        cross = Grix.shape().setColor(Color.mkColor(40, 40, 40)).drawmode(gl.LINES)
        setupGrid()
        cross.populate()
    }

    export function update(delta: number) {
        if (run < 0) run += delta
        else animation += ((animation < (2500 + 1720)) ? 1 : 5) * delta
    }

    export function render(delta: number) {
        renderGrid()
        renderRules()

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

    let maxI = Math.min(WIDTH, Math.floor(((animation - 2500) % 1720)) / (1720/WIDTH))
    let minJ = Math.min(HEIGHT, Math.floor((animation - 2500) / 1720))
    for (let i = 0; i < maxI; i++) {
        for (let j = minJ; j < Math.min(HEIGHT, minJ + 1); j++) {
            setXY(i, j, cell)
            cell.setColor(getBulbColor(i, j))
            cell.render()
        }
    }
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < minJ; j++) {
            setXY(i, j, cell)
            cell.setColor(getBulbColor(i, j))
            cell.render()
        }
    }
}

function renderRules() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 24; j++) {
            let index = Math.floor(j / 3)

            setXY(i - 7, j, cell)
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
    for (let j = 0; j < HEIGHT; j++) {
        for (let i = 0; i < WIDTH; i++) {
            Cell.setCell(i, j, (j == 0) ? Cell.getInitalLine(i, j) : Cell.calculateCell(i, j))
            createCross(i + 7, j)

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
function setXY(x: number, y: number, grix: ShapeGrix) {
    grix.moveTo(280 + x * 25, 155 + y * 25)
}
function getColor(i: number): Col {
    return i == 0 ? BLACK : BLUE
}
function getBulbColor(i: number, j: number): Col {
    return getColor(Cell.getCell(i, j))
}