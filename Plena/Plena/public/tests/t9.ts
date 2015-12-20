//Primitive shadow stuff

module t9 {
    var cat: Grix;
    var rotate: number = 0;
    var count: number = 1;

    export function setup() {
        cat = new Grix()
            .fromTexture(Plena.loadImg("cat.png"))
            .populate()

        Keyboard.addPressedEvent(increseCount, Keyboard.KEY_SPACE);
    }

    export function update(delta: number) {
        rotate += 0.0025 * delta;
    }

    export function render(delta: number) {
        var multiple = (Keyboard.isKeyDown(Keyboard.KEY_D)) ? 2 : 1;

        cat.scaleToSize(10, 10);
        cat.setPivotMove(0.5, 0);
        cat.setPivotRot(250, 250, false);
        cat.moveTo(250, 0);
        cat.rotate(rotate);

        var time = Date.now();
        for (var i = 0; i < 1000 * multiple; i++) {
            cat.render();
            cat.rotate((Math.PI * 2) / count);
            cat.move(0, 250 / 1000);
        }
        console.log(Date.now() - time)
    }

    function increseCount() {
        count += 3 * Math.floor(count / 25) + 1;
    }
}

Plena.init(t9.setup, t9.render, t9.update, 500, 500, [0.4, 0.8, 0.6, 1]);

module Shadow {
    type Point = Vec2
    type Points = Vec2[]
    type Line = Vec4
    type Lines = Vec4[]
    type Shape = Points
    type Shapes = Points[]

    export function shadow(light: Points, allShapes: Shapes): Points {
        var lines       : Lines  = [];
        var points      : Points = [];
        var pointsFinal : Points = [];
        var shapes      : Shapes = [];

        var originY = light.pop();
        var originX = light.pop();

        light.          forEach((val: Point, i: number, arr: Points)  => { points.push(val) })
        toLines(light). forEach((val: Line,  i: number, arr: Lines)   => { lines .push(val) })
    
        for (var index = 0; index < allShapes.length; index++) {
            var shape       :Points = shapes[index];
            var shapeLines  :Lines  = toLines(shape);

            var flag = false;
            shapeLines.filter(function (line: Line, index: number, lines: Lines): boolean {
                if()
            }

            if (shapeLines.filter(function (line: Geometry.Line, index: number, array: Geometry.Line[]): boolean {
                return Geometry.distenceToLine(center, line) < light.width / 2;
            }).length > 0) {
                var obstrPoints: Geometry.Point[] = [];
                intersectShapes.push(shapeLines);

                for (var jdex = 0; jdex < shape.length; jdex++) {
                    var point = shape[jdex]
                    var rad = getRad(center, point)

                    var line1 = Geometry.line(center, point)
                    var line2 = castRay(light, center, rad + 0.0001)
                    var line3 = castRay(light, center, rad - 0.0001)

                    var free = true;
                    var free2 = true;
                    var free3 = true;

                    for (var kdex = 0; kdex < shapeLines.length; kdex++) {
                        var line = shapeLines[kdex];

                        var sect1 = Geometry.linesegmentIntersectAt(line, line1);
                        var sect2 = Geometry.linesegmentIntersectAt(line, line2);
                        var sect3 = Geometry.linesegmentIntersectAt(line, line3);

                        if (sect1 != null) {
                            if (!(line1.p2 == line.p1 || line1.p2 == line.p2)) {
                                free = false;
                                break;
                            }
                        }

                        if (sect2 != null) free2 = false;
                        else if (sect3 != null) free3 = false;
                    }

                    if (free) {
                        points.push(point);
                        obstrPoints.push(point);

                        if (free2) points.push(line2.p2);
                        if (free3) points.push(line3.p2);
                    }
                }

                var obstrLinesAdd = Geometry.toLines(obstrPoints);
                for (var index2 = 0; index2 < obstrLinesAdd.length; index2++) {
                    obstrLines.push(obstrLinesAdd[index2]);
                }
            }
        }

        return null;
    }

    export function toLines(points: Points): Lines {
        var lines:Lines = [];

        for (var index = 0; index < points.length; index++) {
            lines.push(points[index]);

            if (index + 1 < points.length) lines.push(points[index + 1])
            else lines.push(points[0])
        }

        return lines;
    }

    function collidingShadow() {

    }

    function spotShadow() {

    }
}