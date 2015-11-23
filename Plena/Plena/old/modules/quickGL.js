var QuickGL;
(function (QuickGL) {
    var loopFc;
    var canvas;
    var shadColFrag = "precision highp float; uniform vec4 color; void main(void){ gl_FragColor = color; }";
    var shadColVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; attribute vec2 vertexPos; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); }";
    var shadTexFrag = " precision highp float; varying vec2 UV; uniform sampler2D sampler; void main(void){ gl_FragColor = texture2D(sampler, UV); }";
    var shadTexVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; varying vec2 UV; attribute vec2 vertexPos; attribute vec2 vertexUV; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); UV = vertexUV; }";
    QuickGL.width;
    QuickGL.height;
    function initGL(setupFunc, loopFunc, p1, p2, p3, p4, p5) {
        var width, height, x, y;
        if (typeof p3 == 'number') {
            width = p3;
            height = p4;
            x = p1;
            y = p2;
        }
        else {
            width = window.innerWidth;
            height = window.innerHeight;
            x = 0;
            y = 0;
        }
        var color = typeof p1 != 'number' && typeof p1 != 'undefined' ? p1 : typeof p5 != 'undefined' ? p5 : [1, 1, 1, 1];
        canvas = document.createElement('canvas');
        canvas.setAttribute("width", "" + width);
        canvas.setAttribute("height", "" + height);
        canvas.setAttribute("style", "position:fixed; top:" + y + "px; left:" + x + "px");
        document.body.appendChild(canvas);
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
        looper();
    }
    QuickGL.initGL = initGL;
    function looper() {
        loopFc();
        requestAnimationFrame(looper);
    }
    function createShader(typ) {
        var shad;
        if (typ == ShaderType.COLOR) {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "color": Shader.COLOR }, shadColVertex, shadColFrag);
        }
        else {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX }, shadTexVertex, shadTexFrag);
        }
        shad.matrix.setModelMatrix(Matrix4.identity());
        shad.matrix.setProjectionMatrix(Matrix4.identity());
        shad.matrix.setViewMatrix(Matrix4.identity());
        return shad;
    }
    QuickGL.createShader = createShader;
    //SImPle Renderer
    var SIPRender = (function () {
        function SIPRender(shader, startType) {
            this.drawer = new Render();
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
        SIPRender.prototype.addTexture = function (par1) {
            if (typeof par1 == "object") {
                var coord = par1.coord;
                this.drawer.addUVCoords(this.shader, [coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
            }
            else
                this.drawer.addUVCoords(this.shader, par1);
        };
        SIPRender.prototype.setColorV3 = function (color) {
            color.push(1);
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.shader.setVec4(Shader.COLOR, color);
        };
        SIPRender.prototype.setColorV4 = function (color) {
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.shader.setVec4(Shader.COLOR, color);
        };
        SIPRender.prototype.setColorRGB = function (r, g, b) {
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.shader.setVec4(Shader.COLOR, [r / 255, g / 255, b / 255, 1]);
        };
        SIPRender.prototype.setColorRBGA = function (r, g, b, a) {
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.shader.setVec4(Shader.COLOR, [r / 255, g / 255, b / 255, a / 255]);
        };
        SIPRender.prototype.rect = function (p1, p2, p3, p4) {
            var x, y, w, h;
            if (typeof p1 == 'number') {
                x = p1;
                y = p2;
                w = p3;
                h = p4;
            }
            else {
                x = p1.x;
                y = p1.y;
                w = p1.width;
                h = p1.height;
            }
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.matrixHandler.setModelMatrix(Matrix4.scale(Matrix4.translate(x, y), w, h));
            this.render(SIPRender.RECTANGLE);
        };
        SIPRender.prototype.line = function (p1, p2, p3, p4) {
            var x1, y1, x2, y2;
            if (typeof p1 == 'number') {
                x1 = p1;
                y1 = p2;
                x2 = p3;
                y2 = p4;
            }
            else {
                x1 = p1.p1.x;
                y1 = p1.p1.y;
                x2 = p1.p2.x;
                y2 = p1.p2.y;
            }
            if (this.startType == StartType.AUTO)
                this.shader.bind();
            this.matrixHandler.setModelMatrix(Matrix4.scale(Matrix4.translate(x1, y1), x2 - x1, y2 - y1));
            this.render(SIPRender.LINE);
        };
        SIPRender.prototype.render = function (id) {
            if (this.startType == StartType.AUTO) {
                if (id == 0)
                    this.drawer.drawElementsWithStartEnd(gl.TRIANGLES, 0);
                if (id == 1)
                    this.drawer.drawElementsWithStartEnd(gl.LINES, 1);
            }
            else {
                if (id == 0)
                    this.drawer.drawElements(0, gl.TRIANGLES);
                else if (id == 1)
                    this.drawer.drawElements(1, gl.LINES);
            }
        };
        SIPRender.RECTANGLE = 0;
        SIPRender.LINE = 1;
        return SIPRender;
    })();
    QuickGL.SIPRender = SIPRender;
    (function (StartType) {
        StartType[StartType["ONCE"] = 0] = "ONCE";
        StartType[StartType["AUTO"] = 1] = "AUTO";
        StartType[StartType["MANUAL"] = 2] = "MANUAL";
    })(QuickGL.StartType || (QuickGL.StartType = {}));
    var StartType = QuickGL.StartType;
    ;
    (function (ShaderType) {
        ShaderType[ShaderType["COLOR"] = 0] = "COLOR";
        ShaderType[ShaderType["TEXTURE"] = 1] = "TEXTURE";
    })(QuickGL.ShaderType || (QuickGL.ShaderType = {}));
    var ShaderType = QuickGL.ShaderType;
})(QuickGL || (QuickGL = {}));
//# sourceMappingURL=quickGL.js.map