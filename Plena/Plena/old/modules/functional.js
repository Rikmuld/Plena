var Camera = (function () {
    function Camera() {
        this.position = [0, 0];
    }
    Camera.prototype.setView = function (x, y) {
        this.position = [x, y];
    };
    Camera.prototype.setX = function (x) {
        this.position[0] = x;
    };
    Camera.prototype.setZ = function (y) {
        this.position[1] = y;
    };
    Camera.prototype.getViewMatrix = function () {
        return Matrix4.translate(-this.position[0], -this.position[1]);
    };
    return Camera;
})();
var MMath;
(function (MMath) {
    var SEED = 0;
    var TO_RAD = (Math.PI * 2) / 360;
    var TO_DEG = 360 / (Math.PI * 2);
    function setRandomSeed(seed) {
        SEED = seed;
    }
    MMath.setRandomSeed = setRandomSeed;
    function random(min, max) {
        if (typeof min == undefined) {
            min = 0;
            max = 1;
        }
        SEED = (SEED * 9301 + 49297) % 233280;
        var rnd = SEED / 233280;
        return min + rnd * (max - min);
    }
    MMath.random = random;
    function toRad(deg) {
        return deg * TO_DEG;
    }
    MMath.toRad = toRad;
    function toDeg(rad) {
        return rad * TO_RAD;
    }
    MMath.toDeg = toDeg;
    function mod(num, max) {
        return ((num % max) + max) % max;
    }
    MMath.mod = mod;
})(MMath || (MMath = {}));
var GLF;
(function (GLF) {
    function clearBufferColor() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    GLF.clearBufferColor = clearBufferColor;
    function clearColor(color) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }
    GLF.clearColor = clearColor;
})(GLF || (GLF = {}));
var Shadow;
(function (Shadow) {
    function getShadowFan(light, shapes, overlap) {
        var points = [];
        var obstrLines = [];
        var center = Geometry.point(light.x + light.width / 2, light.y + light.height / 2);
        var lightPoints = Geometry.toPoints(light);
        var lightLines = Geometry.toLines(lightPoints);
        lightPoints.forEach(function (point, index, array) {
            points.push(point);
        });
        lightLines.forEach(function (line, index, array) {
            obstrLines.push(line);
        });
        var intersectShapes = [];
        for (var index = 0; index < shapes.length; index++) {
            var shape = shapes[index];
            var shapeLines = Geometry.toLines(shape);
            if (shapeLines.filter(function (line, index, array) {
                return Geometry.distenceToLine(center, line) < light.width / 2;
            }).length > 0) {
                var obstrPoints = [];
                intersectShapes.push(shapeLines);
                for (var jdex = 0; jdex < shape.length; jdex++) {
                    var point = shape[jdex];
                    var rad = getRad(center, point);
                    var line1 = Geometry.line(center, point);
                    var line2 = castRay(light, center, rad + 0.0001);
                    var line3 = castRay(light, center, rad - 0.0001);
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
                        if (sect2 != null)
                            free2 = false;
                        else if (sect3 != null)
                            free3 = false;
                    }
                    if (free) {
                        points.push(point);
                        obstrPoints.push(point);
                        if (free2)
                            points.push(line2.p2);
                        if (free3)
                            points.push(line3.p2);
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
        var sortPoints = [];
        if (!overlap) {
            var obstrCompare = function (l1, l2) {
                var dist1 = Geometry.distenceToLine(center, l1);
                var dist2 = Geometry.distenceToLine(center, l2);
                if (dist1 < dist2)
                    return -1;
                if (dist1 > dist2)
                    return 1;
                return 0;
            };
            obstrLines.sort(obstrCompare);
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
                        }
                        else {
                            if (Vector2.magnitude(Vector2.fromLine(rayLine)) > Geometry.distance(center, intersect)) {
                                point = intersect;
                                rayLine = Geometry.line(center, point);
                            }
                        }
                    }
                }
            }
            if (free)
                sortPoints.push(point);
        }
        var pointCompare = function (p1, p2) {
            var rad1 = getRad(center, p1);
            var rad2 = getRad(center, p2);
            if (rad1 < rad2)
                return -1;
            if (rad1 > rad2)
                return 1;
            return 0;
        };
        sortPoints.sort(pointCompare);
        var retArray = [];
        retArray.push(center.x);
        retArray.push(center.y);
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
    Shadow.getShadowFan = getShadowFan;
    function castRay(box, from, rad) {
        rad += Math.PI * 0.25;
        if (rad > 2 * Math.PI)
            rad -= Math.PI * 2;
        var x, y;
        if (rad < Math.PI * 0.5) {
            x = box.x + box.width;
            y = from.y - box.width / 2 * Math.tan(rad - Math.PI * 0.25);
        }
        else if (rad < Math.PI) {
            y = box.y;
            x = from.x - box.height / 2 * Math.tan(rad - Math.PI * 0.75);
        }
        else if (rad < Math.PI * 1.5) {
            x = box.x;
            y = from.y + box.width / 2 * Math.tan(rad - Math.PI * 1.25);
        }
        else if (rad < Math.PI * 2) {
            y = box.y + box.height;
            x = from.x + box.height / 2 * Math.tan(rad - Math.PI * 1.75);
        }
        return Geometry.line(from, Geometry.point(x, y));
    }
    function getRad(point, refPoint) {
        var angle = Vector2.angle(Vector2.fromLine(Geometry.line(point, refPoint)), [1, 0]);
        if (refPoint.y > point.y)
            angle = (2 * Math.PI) - angle;
        return angle;
    }
    function getShapeIntersects(s1, s2) {
        var pps = [];
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
})(Shadow || (Shadow = {}));
var Geometry;
(function (Geometry) {
    function linesegmentIntersectAt(l1, l2) {
        var point = Geometry.lineIntersectAt(l1, l2);
        if (point == null)
            return null;
        if (!(point.x >= Math.min(l1.p1.x, l1.p2.x) - 0.001 && point.x <= Math.max(l1.p1.x, l1.p2.x) + 0.001))
            return null;
        if (!(point.x >= Math.min(l2.p1.x, l2.p2.x) - 0.001 && point.x <= Math.max(l2.p1.x, l2.p2.x) + 0.001))
            return null;
        if (!(point.y >= Math.min(l1.p1.y, l1.p2.y) - 0.001 && point.y <= Math.max(l1.p1.y, l1.p2.y) + 0.001))
            return null;
        if (!(point.y >= Math.min(l2.p1.y, l2.p2.y) - 0.001 && point.y <= Math.max(l2.p1.y, l2.p2.y) + 0.001))
            return null;
        return point;
    }
    Geometry.linesegmentIntersectAt = linesegmentIntersectAt;
})(Geometry || (Geometry = {}));
//# sourceMappingURL=functional.js.map