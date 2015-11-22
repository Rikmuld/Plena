class Camera {
    position = [0, 0];

    setView(x: number, y: number) {
        this.position = [x, y];
    }

    setX(x: number) {
        this.position[0] = x;
    }

    setZ(y: number) {
        this.position[1] = y;
    }

    getViewMatrix() {
        return Matrix4.translate(-this.position[0], -this.position[1]);
    }
}

module MMath {
    var SEED:number = 0;
    var TO_RAD: number = (Math.PI * 2) / 360;
    var TO_DEG: number = 360 / (Math.PI * 2);

    export function setRandomSeed(seed:number) {
        SEED = seed;
    }

    export function random(): number;
    export function random(min: number, max: number): number;
    export function random(min?: number, max?: number): number {
        if (typeof min == undefined) {
            min = 0;
            max = 1;
        }

        SEED = (SEED * 9301 + 49297) % 233280;
        var rnd = SEED / 233280;

        return min + rnd * (max - min);
    }

    export function toRad(deg: number): number {
        return deg * TO_DEG;
    }

    export function toDeg(rad: number): number {
        return rad * TO_RAD;
    }

    export function mod(num: number, max: number): number {
        return ((num % max) + max) % max;
    }
}

module GLF {
    export function clearBufferColor() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    export function clearColor(color: Vec4) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }
}

module Shadow{ 
    export function getShadowFan(light: Geometry.Rectangle, shapes: Geometry.Point[][], overlap:boolean): number[] {
        var points: Geometry.Point[] = [];
        var obstrLines: Geometry.Line[] = [];

        var center = Geometry.point(light.x + light.width / 2, light.y + light.height / 2); 

        var lightPoints = Geometry.toPoints(light);
        var lightLines = Geometry.toLines(lightPoints);

        lightPoints.forEach((point: Geometry.Point, index: number, array: Geometry.Point[]) => {
            points.push(point);
        });
        lightLines.forEach((line: Geometry.Line, index: number, array: Geometry.Line[]) => {
            obstrLines.push(line);
        });

        var intersectShapes:Geometry.Line[][] = [];

        for (var index = 0; index < shapes.length; index++) {
            var shape = shapes[index];
            var shapeLines = Geometry.toLines(shape);

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

        if (overlap) {
            for (var p = 0; p < intersectShapes.length; p++) {
                for (var j = p + 1; j < intersectShapes.length; j++) {
                    var pps = getShapeIntersects(intersectShapes[p], intersectShapes[j]);
                    for (var l = 0; l < pps.length; l++) {
                        var point = pps[l];
                        points.push(point);
                    }
                }
            }
        }

        var sortPoints: Geometry.Point[] = [];
        if (!overlap) {
            var obstrCompare = function (l1: Geometry.Line, l2: Geometry.Line): number {
                var dist1 = Geometry.distenceToLine(center, l1);
                var dist2 = Geometry.distenceToLine(center, l2);

                if (dist1 < dist2) return -1;
                if (dist1 > dist2) return 1;
                return 0;
            }
            obstrLines.sort(obstrCompare)
        }

        for (var index = 0; index < points.length; index++) {
            var point = points[index];
            var rayLine = Geometry.line(center, point);
            var free = true;

            for (var jdex = 0; jdex < obstrLines.length; jdex++) {
                var line = obstrLines[jdex];

                var intersect = Geometry.linesegmentIntersectAt(line, rayLine);
                if (intersect != null) {
                    if (!(Geometry.eqPoint(rayLine.p2, line.p1) || Geometry.eqPoint(rayLine.p2, line.p2))) {
                        if (!overlap) {
                            free = false;
                            sortPoints.push(intersect);
                            break;
                        } else {
                            if (Vector2.magnitude(Vector2.fromLine(rayLine)) > Geometry.distance(center, intersect)) {
                                point = intersect;
                                rayLine = Geometry.line(center, point);
                            }
                        }
                    }
                }
            }

            if(free)sortPoints.push(point);
        }

        var pointCompare = function (p1: Geometry.Point, p2: Geometry.Point):number {
            var rad1 = getRad(center, p1);
            var rad2 = getRad(center, p2);

            if (rad1 < rad2) return -1;
            if (rad1 > rad2) return 1;
            return 0;
        }
       
        sortPoints.sort(pointCompare)

        var retArray: number[] = [];
        retArray.push(center.x)
        retArray.push(center.y)

        for (var index = 0; index < sortPoints.length; index++) {
            point = sortPoints[index];
            retArray.push(point.x);
            retArray.push(point.y);
        }

        if (sortPoints.length > 0) {
            var firstpoint = sortPoints[0];
            retArray.push(firstpoint.x);
            retArray.push(firstpoint.y);
        }

        return retArray;
    }

    function castRay(box: Geometry.Rectangle, from:Geometry.Point, rad:number): Geometry.Line {
        rad += Math.PI * 0.25;
        if (rad > 2 * Math.PI) rad -= Math.PI * 2;

        var x, y;

        if (rad < Math.PI * 0.5) {
            x = box.x + box.width;
            y = from.y - box.width/2 * Math.tan(rad - Math.PI * 0.25)
        }
        else if (rad < Math.PI) {
            y = box.y;
            x = from.x - box.height/2 * Math.tan(rad - Math.PI * 0.75)
        }
        else if (rad < Math.PI * 1.5) {
            x = box.x;
            y = from.y + box.width/2 * Math.tan(rad - Math.PI * 1.25)
        }
        else if (rad < Math.PI * 2) {
            y = box.y + box.height;
            x = from.x + box.height/2 * Math.tan(rad - Math.PI * 1.75)
        }

        return Geometry.line(from, Geometry.point(x, y));
    }

    function getRad(point: Geometry.Point, refPoint: Geometry.Point): number {
        var angle = Vector2.angle(Vector2.fromLine(Geometry.line(point, refPoint)), [1, 0]);
        if (refPoint.y > point.y) angle = (2 * Math.PI) - angle;

        return angle;
    }

    function getShapeIntersects(s1: Geometry.Line[], s2: Geometry.Line[]): Geometry.Point[]{
        var pps: Geometry.Point[] = [];

        for (var i = 0; i < s1.length; i++) {
            for (var j = 0; j < s2.length; j++) {
                var p = Geometry.linesegmentIntersectAt(s1[i], s2[j]);
                if (p != null) {
                    pps.push(p);
                }
            }
        }

        return pps;
    }
}

module Geometry {
    export function linesegmentIntersectAt(l1: Line, l2: Line): Point {
        var point = lineIntersectAt(l1, l2);

        if (point == null) return null;
        if (!(point.x >= Math.min(l1.p1.x, l1.p2.x) - 0.001 && point.x <= Math.max(l1.p1.x, l1.p2.x) + 0.001)) return null;
        if (!(point.x >= Math.min(l2.p1.x, l2.p2.x) - 0.001 && point.x <= Math.max(l2.p1.x, l2.p2.x) + 0.001)) return null;
        if (!(point.y >= Math.min(l1.p1.y, l1.p2.y) - 0.001 && point.y <= Math.max(l1.p1.y, l1.p2.y) + 0.001)) return null;
        if (!(point.y >= Math.min(l2.p1.y, l2.p2.y) - 0.001 && point.y <= Math.max(l2.p1.y, l2.p2.y) + 0.001)) return null;

        return point;
    }
}