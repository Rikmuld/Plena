var PRECISION = 5;

module Geometry {
    export interface Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export function eqRec(r1: Rectangle, r2: Rectangle): boolean {
        return r1.x == r2.x && r1.y == r2.y && r1.width == r2.width && r1.height == r2.height;
    }

    export interface Line {
        p1: Point;
        p2: Point;
    }

    export function eqLine(l1: Line, l2: Line): boolean {
        return eqPoint(l1.p1, l2.p1) && eqPoint(l1.p2, l2.p2);
    }

    export interface Point {
        x: number;
        y: number;
    }

    export function eqPoint(p1: Point, p2: Point):boolean {
        return p1.x == p2.x && p1.y == p2.y;
    }

    export function point(x: number, y: number): Point {
        return { x: x, y: y };
    }

    export function line(point_1: Point, point_2: Point): Line;
    export function line(x1: number, y1: number, x2: number, y2: number): Line;
    export function line(p1: number|Point, p2: number|Point, p3?: number, p4?: number): Line {
        if (typeof p1 == 'number') return { p1: { x: <number>p1, y: <number>p2 }, p2: { x: p3, y: p4 } }
        else return { p1: <Point>p1, p2: <Point>p2 };
    }

    export function toPoints(line: Line): Point[];
    export function toPoints(line: Rectangle): Point[];
    export function toPoints(p1: Line|Rectangle): Point[]{
        if (typeof (<Rectangle>p1).x != 'undefined') {
            var rect = <Rectangle> p1;
            return [point(rect.x, rect.y), point(rect.width + rect.x, rect.y), point(rect.x + rect.width, rect.y + rect.height), point(rect.x, rect.y + rect.height)];
        }
        else return [(<Line>p1).p1, (<Line>p1).p2];
    }

    export function toLines(points: Point[]): Line[] {
        var lines = [];

        for (var index = 0; index < points.length; index++) {
            lines[index] = (index == points.length - 1) ? line(points[index], points[0]) : line(points[index], points[index + 1]);
        }

        return lines;
    }

    export function rectangle(x: number, y: number, width: number, height: number): Rectangle {
        return { x: x, y: y, width: width, height: height };
    }

    export function rectangleCollTest(rec1: Rectangle, rec2: Rectangle): boolean {
        return (rec1.x < rec2.x + rec2.width && rec1.x + rec1.width > rec2.x && rec1.y < rec2.y + rec2.height && rec1.height + rec1.y > rec2.y);
    }

    export function lineIntersectAt(l1: Line, l2: Line): Point {
        var delta = (l1.p1.x - l1.p2.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l1.p2.y) * (l2.p1.x - l2.p2.x);
        if (delta == 0) return null;

        return {
            x: ((l2.p1.x - l2.p2.x) * (l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) - (l1.p1.x - l1.p2.x) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)) / delta,
            y: ((l2.p1.y - l2.p2.y) * (l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) - (l1.p1.y - l1.p2.y) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)) / delta
        };
    }

    export function distanceSq(p1: Point, p2: Point): number {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    }

    export function distance(p1: Point, p2: Point): number {
        return Math.sqrt(distanceSq(p1, p2));
    }

    export function distenceToLine(p: Point, l: Line): number {
        var length = distanceSq(l.p1, l.p2);
        if (length == 0) return distance(p, l.p1);

        var num = ((p.x - l.p1.x) * (l.p2.x - l.p1.x) + (p.y - l.p1.y) * (l.p2.y - l.p1.y)) / length;
        if (num < 0) return distance(p, l.p1)
        if (num > 1) return distance(p, l.p2)
        return distance(p, point(l.p1.x + num * (l.p2.x - l.p1.x), l.p1.y + num * (l.p2.y - l.p1.y)));
    }
}