var PRECISION = 5;
var Geometry;
(function (Geometry) {
    function eqRec(r1, r2) {
        return r1.x == r2.x && r1.y == r2.y && r1.width == r2.width && r1.height == r2.height;
    }
    Geometry.eqRec = eqRec;
    function eqLine(l1, l2) {
        return eqPoint(l1.p1, l2.p1) && eqPoint(l1.p2, l2.p2);
    }
    Geometry.eqLine = eqLine;
    function eqPoint(p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    }
    Geometry.eqPoint = eqPoint;
    function point(x, y) {
        return { x: x, y: y };
    }
    Geometry.point = point;
    function line(p1, p2, p3, p4) {
        if (typeof p1 == 'number')
            return { p1: { x: p1, y: p2 }, p2: { x: p3, y: p4 } };
        else
            return { p1: p1, p2: p2 };
    }
    Geometry.line = line;
    function toPoints(p1) {
        if (typeof p1.x != 'undefined') {
            var rect = p1;
            return [point(rect.x, rect.y), point(rect.width + rect.x, rect.y), point(rect.x + rect.width, rect.y + rect.height), point(rect.x, rect.y + rect.height)];
        }
        else
            return [p1.p1, p1.p2];
    }
    Geometry.toPoints = toPoints;
    function toLines(points) {
        var lines = [];
        for (var index = 0; index < points.length; index++) {
            lines[index] = (index == points.length - 1) ? line(points[index], points[0]) : line(points[index], points[index + 1]);
        }
        return lines;
    }
    Geometry.toLines = toLines;
    function rectangle(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }
    Geometry.rectangle = rectangle;
    function rectangleCollTest(rec1, rec2) {
        return (rec1.x < rec2.x + rec2.width && rec1.x + rec1.width > rec2.x && rec1.y < rec2.y + rec2.height && rec1.height + rec1.y > rec2.y);
    }
    Geometry.rectangleCollTest = rectangleCollTest;
    function lineIntersectAt(l1, l2) {
        var delta = (l1.p1.x - l1.p2.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l1.p2.y) * (l2.p1.x - l2.p2.x);
        if (delta == 0)
            return null;
        return {
            x: ((l2.p1.x - l2.p2.x) * (l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) - (l1.p1.x - l1.p2.x) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)) / delta,
            y: ((l2.p1.y - l2.p2.y) * (l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) - (l1.p1.y - l1.p2.y) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)) / delta
        };
    }
    Geometry.lineIntersectAt = lineIntersectAt;
    function distanceSq(p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    }
    Geometry.distanceSq = distanceSq;
    function distance(p1, p2) {
        return Math.sqrt(distanceSq(p1, p2));
    }
    Geometry.distance = distance;
    function distenceToLine(p, l) {
        var length = distanceSq(l.p1, l.p2);
        if (length == 0)
            return distance(p, l.p1);
        var num = ((p.x - l.p1.x) * (l.p2.x - l.p1.x) + (p.y - l.p1.y) * (l.p2.y - l.p1.y)) / length;
        if (num < 0)
            return distance(p, l.p1);
        if (num > 1)
            return distance(p, l.p2);
        return distance(p, point(l.p1.x + num * (l.p2.x - l.p1.x), l.p1.y + num * (l.p2.y - l.p1.y)));
    }
    Geometry.distenceToLine = distenceToLine;
})(Geometry || (Geometry = {}));
//# sourceMappingURL=geometry.js.map