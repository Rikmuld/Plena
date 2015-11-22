module QuickGL {
    var loopFc;
    var canvas;
    var shadColFrag = "precision highp float; uniform vec4 color; void main(void){ gl_FragColor = color; }";
    var shadColVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; attribute vec2 vertexPos; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); }";
    var shadTexFrag = " precision highp float; varying vec2 UV; uniform sampler2D sampler; void main(void){ gl_FragColor = texture2D(sampler, UV); }";
    var shadTexVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; varying vec2 UV; attribute vec2 vertexPos; attribute vec2 vertexUV; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); UV = vertexUV; }";

    export var width: number;
    export var height: number;

    export function initGL(setupFunc, loopFunc);
    export function initGL(setupFunc, loopFunc, x: number, y: number, width: number, height: number);
    export function initGL(setupFunc, loopFunc, color: number[]);
    export function initGL(setupFunc, loopFunc, x: number, y: number, width: number, height: number, color: number[]);
    export function initGL(setupFunc, loopFunc, p1?: number|number[], p2?: number, p3?: number, p4?: number, p5?: number[]) {
        var width, height, x, y: number;
        if (typeof p3 == 'number') {
            width = p3;
            height = p4;
            x = p1;
            y = p2;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
            x = 0;
            y = 0;
        }
        var color = typeof p1 != 'number' && typeof p1 != 'undefined' ? p1 : typeof p5 != 'undefined' ? p5 : [1, 1, 1, 1];

        canvas = document.createElement('canvas');
        canvas.setAttribute("width", "" + width);
        canvas.setAttribute("height", "" + height);
        canvas.setAttribute("style", "position:fixed; top:" + y + "px; left:" + x + "px")
        document.body.appendChild(canvas)

        QuickGL.width = width;
        QuickGL.height = height;

        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, width, height);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        Keyboard.listenForKeys();
        Mouse.listenForPosition();
        Mouse.listenForClick();

        loopFc = loopFunc;
        setupFunc();
        looper()
    }

    function looper() {
        loopFc()
        requestAnimationFrame(looper);
    }

    export function createShader(typ: ShaderType): Shader {
        var shad: Shader;
        if (typ == ShaderType.COLOR) {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "color": Shader.COLOR }, shadColVertex, shadColFrag);
        } else {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX }, shadTexVertex, shadTexFrag);
        }

        shad.matrix.setModelMatrix(Matrix4.identity());
        shad.matrix.setProjectionMatrix(Matrix4.identity());
        shad.matrix.setViewMatrix(Matrix4.identity());

        return shad;
    }

    //SImPle Renderer
    export class SIPRender {
        static RECTANGLE = 0;
        static LINE = 1;

        shader: Shader;
        matrixHandler: MatrixHandler;
        drawer = new Render();
        startType: StartType;

        constructor(shader: Shader, startType: StartType) {
            this.shader = shader;
            this.matrixHandler = shader.matrix;
            this.startType = startType;

            this.drawer.addVertexes(shader, [0, 0, 1, 0, 1, 1, 0, 1]);

            this.drawer.addIndieces([0, 1, 3, 1, 2, 3]);
            this.drawer.addIndieces([0, 2]);

            this.startType = startType;
            if (this.startType == StartType.ONCE) {
                shader.bind();
                this.drawer.start();
            }
        }
        addTexture(texture: TextureBase);
        addTexture(UVCoords: number[]);
        addTexture(par1: any): any {
            if (typeof par1 == "object") {
                var coord = par1.coord;
                this.drawer.addUVCoords(this.shader, [coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
            } else this.drawer.addUVCoords(this.shader, par1)
        }
        setColorV3(color: number[]) {
            color.push(1);
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.shader.setVec4(Shader.COLOR, color);
        }
        setColorV4(color: number[]) {
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.shader.setVec4(Shader.COLOR, color);
        }
        setColorRGB(r: number, g: number, b: number) {
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.shader.setVec4(Shader.COLOR, [r / 255, g / 255, b / 255, 1]);
        }
        setColorRBGA(r: number, g: number, b: number, a: number) {
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.shader.setVec4(Shader.COLOR, [r / 255, g / 255, b / 255, a / 255]);
        }
        rect(x: number, y: number, width: number, height: number);
        rect(rect: Geometry.Rectangle);
        rect(p1: any, p2?: any, p3?: any, p4?: any) {
            var x, y, w, h: number;
            if (typeof p1 == 'number') {
                x = p1;
                y = p2;
                w = p3;
                h = p4;
            } else {
                x = (<Geometry.Rectangle>p1).x;
                y = (<Geometry.Rectangle>p1).y;
                w = (<Geometry.Rectangle>p1).width;
                h = (<Geometry.Rectangle>p1).height;
            }
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.matrixHandler.setModelMatrix(Matrix4.scale(Matrix4.translate(x, y), w, h));
            this.render(SIPRender.RECTANGLE);
        }
        line(x1: number, y1: number, x2: number, y2: number);
        line(line: Geometry.Line);
        line(p1: any, p2?: any, p3?: any, p4?: any) {
            var x1, y1, x2, y2: number;
            if (typeof p1 == 'number') {
                x1 = p1;
                y1 = p2;
                x2 = p3;
                y2 = p4;
            } else {
                x1 = (<Geometry.Line>p1).p1.x;
                y1 = (<Geometry.Line>p1).p1.y;
                x2 = (<Geometry.Line>p1).p2.x;
                y2 = (<Geometry.Line>p1).p2.y;
            }
            if (this.startType == StartType.AUTO) this.shader.bind();
            this.matrixHandler.setModelMatrix(Matrix4.scale(Matrix4.translate(x1, y1), x2 - x1, y2 - y1));
            this.render(SIPRender.LINE);
        }
        render(id: number) {
            if (this.startType == StartType.AUTO) {
                if (id == 0) this.drawer.drawElementsWithStartEnd(gl.TRIANGLES, 0);
                if (id == 1) this.drawer.drawElementsWithStartEnd(gl.LINES, 1);
            } else {
                if (id == 0) this.drawer.drawElements(0, gl.TRIANGLES);
                else if (id == 1) this.drawer.drawElements(1, gl.LINES);
            }
        }
    }

    export enum StartType { ONCE, AUTO, MANUAL };
    export enum ShaderType { COLOR, TEXTURE }
}