var gl;
var Plena;
(function (Plena) {
    var loopFc;
    var canvas;
    var shadColFrag = "precision highp float; uniform vec4 color; void main(void){ gl_FragColor = color; }";
    var shadColVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; attribute vec2 vertexPos; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); }";
    var shadTexFrag = " precision highp float; varying vec2 UV; uniform sampler2D sampler; void main(void){ gl_FragColor = texture2D(sampler, UV); }";
    var shadTexVertex = " precision highp float; uniform mat4 modelMatrix; uniform mat4 projectionMatrix; uniform mat4 viewMatrix; varying vec2 UV; attribute vec2 vertexPos; attribute vec2 vertexUV; void main(void){ gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); UV = vertexUV; }";
    Plena.width;
    Plena.height;
    var colorShader;
    var textureShader;
    var spriteManager;
    function init(setupFunc, loopFunc, p1, p2, p3, p4, p5) {
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
        width = width;
        height = height;
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, width, height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        Keyboard.listenForKeys();
        Mouse.listenForPosition();
        Mouse.listenForClick();
        colorShader = createShader(ShaderType.COLOR);
        textureShader = createShader(ShaderType.TEXTURE);
        spriteManager = createManager();
        loopFc = loopFunc;
        setupFunc();
        looper();
    }
    Plena.init = init;
    function looper() {
        loopFc();
        requestAnimationFrame(looper);
    }
    (function (ShaderType) {
        ShaderType[ShaderType["COLOR"] = 0] = "COLOR";
        ShaderType[ShaderType["TEXTURE"] = 1] = "TEXTURE";
    })(Plena.ShaderType || (Plena.ShaderType = {}));
    var ShaderType = Plena.ShaderType;
    function createShader(typ) {
        var shad;
        if (typ == ShaderType.COLOR) {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "color": Shader.COLOR }, shadColVertex, shadColFrag);
        }
        else {
            shad = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX }, shadTexVertex, shadTexFrag);
        }
        shad.getMatHandler().setModelMatrix(Matrix4.identity());
        shad.getMatHandler().setProjectionMatrix(Matrix4.identity());
        shad.getMatHandler().setViewMatrix(Matrix4.identity());
        return shad;
    }
    Plena.createShader = createShader;
    function manager() {
        return spriteManager;
    }
    Plena.manager = manager;
    function createManager() {
        return new Manager();
    }
    Plena.createManager = createManager;
    var Manager = (function () {
        function Manager() {
            this.shaders = new TreeMap(STRING_COMPARE);
            this.grixs = new DeepTreeMap(STRING_COMPARE);
        }
        Manager.prototype.addShader = function (shader) {
            this.shaders.put(shader.getId(), shader);
        };
        Manager.prototype.getShader = function (key) {
            return this.shaders.apply(key);
        };
        Manager.prototype.addGrix = function (key, grix) {
            this.grixs.put((typeof key == "string") ? key : key.getId(), grix);
        };
        Manager.prototype.render = function () {
            var ittr = this.shaders.itterator();
            for (var i = 0; i < ittr.length; i++) {
                var entry = ittr[i];
                entry[1].bind();
                var grixs = this.grixs.itterator(entry[0]);
                for (var j = 0; j < grixs.length; i++) {
                    grixs[i].render();
                }
            }
        };
        return Manager;
    })();
})(Plena || (Plena = {}));
//# sourceMappingURL=manager.js.map