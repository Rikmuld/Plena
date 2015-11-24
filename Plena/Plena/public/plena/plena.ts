var gl;

//all textures loaded cheack and only then call render/update stuff
module Plena {
    var renderLp, updateLp: () => void;
    var canvas;

    var shadColFrag = "\
        precision highp float; \
        \
        uniform vec4 color; \
        \
        void main(void){ \
            gl_FragColor = color; \
        } ";

    var shadColVertex = "\
        precision highp float; \
        \
        uniform mat4 modelMatrix; \
        uniform mat4 projectionMatrix; \
        uniform mat4 viewMatrix; \
        \
        attribute vec2 vertexPos; \
        \
        void main(void){ \
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); \
        }";

    var shadTexFrag = "\
        precision highp float; \
        \
        varying vec2 UV; \
        \
        uniform sampler2D sampler; \
        \
        void main(void){ \
            gl_FragColor = texture2D(sampler, UV); \
        }";

    var shadTexVertex = "\
        precision highp float; \
        \
        uniform mat4 modelMatrix; \
        uniform mat4 projectionMatrix; \
        uniform mat4 viewMatrix; \
        uniform mat4 UVMatrix; \
        \
        varying vec2 UV; \
        \
        attribute vec2 vertexPos; \
        attribute vec2 vertexUV; \
        \
        void main(void){ \
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos, 1, 1); \
            UV = (UVMatrix * vec4(vertexUV, 1, 1)).xy; \
        } "; 

    export var width: number;
    export var height: number;

    var colorShader: Shader;
    var textureShader: Shader;

    var spriteManager: Manager;

    var textureManager: TextureManager;
    var audioManager: AudioManager;

    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, x: number, y: number, width: number, height: number);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, width: number, height: number);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, width: number, height: number, color: number[]);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, color: number[]);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, x: number, y: number, width: number, height: number, color: number[]);
    export function init(setupFunc: () => void, renderLoop: () => void, updateLoop: () => void, p1?: number|number[], p2?: number, p3?: number|number[], p4?: number, p5?: number[]) {
        var width, height, x, y: number;
        var color: number[];

        if (typeof p3 == 'number') {
            width = p3;
            height = p4;
            x = p1;
            y = p2;
            if (p5) color = <number[]>p5;
            else color = [1, 1, 1, 1]
        } else if (typeof p2 == 'number') {
            console.log("halloes")
            width = p1;
            height = p2;
            x = window.innerWidth / 2 - width / 2;
            y = window.innerHeight / 2 - height / 2;
            if (p3) color = <number[]>p3;
            else color = [1, 1, 1, 1]
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
            x = 0;
            y = 0;
            if (p1) color = <number[]>p1;
            else color = [1, 1, 1, 1]
        }

        textureManager = new TextureManager();
        audioManager = new AudioManager();

        canvas = document.createElement('canvas');
        canvas.setAttribute("width", "" + width);
        canvas.setAttribute("height", "" + height);
        canvas.setAttribute("style", "position:fixed; top:" + y + "px; left:" + x + "px")
        document.body.appendChild(canvas)

        Plena.width = width;
        Plena.height = height;

        gl = canvas.getContext("experimental-webgl");

        GLF.viewPort(0, 0, width, height)
        GLF.alphaBlend();
        GLF.clearColor(color);
        GLF.clearBufferColor();

        Keyboard.listenForKeys();
        Mouse.listenForPosition();
        Mouse.listenForClick();

        colorShader = createShader(ShaderType.COLOR)
        textureShader = createShader(ShaderType.TEXTURE)

        changeProjection(0, width, height, 0)

        spriteManager = createManager();
        spriteManager.addShader(colorShader);
        spriteManager.addShader(textureShader);

        renderLp = renderLoop;
        updateLp = updateLoop;
        setupFunc();
        looper()
    }

    //img filters
    export function loadSpriteFile(src: string, repeat?: boolean, smooth?: boolean, id?: string): Sprite {
        if (!id) id = src.split("/").pop().split('.')[0];
        return textureManager.loadSprite(src, id, repeat, smooth);
    }

    export function loadImg(src: string, repeat?: boolean, smooth?: boolean, id?: string): Img {
        if (!id) id = src.split("/").pop().split('.')[0];
        return textureManager.loadImg(src, id, repeat, smooth);
    }

    export function getImg(key: string): Img {
        return textureManager.getTexture(key);
    }

    export function changeProjection(left: number, bottom: number);
    export function changeProjection(left: number, right: number, bottom: number, top: number);
    export function changeProjection(left: number, right: number, bottom?: number, top?: number) {
        var ortho: Mat4;

        if (typeof bottom == 'number') ortho = Matrix4.ortho(left, right, bottom, top);
        else ortho = Matrix4.ortho(0, left, right, 0);

        colorShader.bind();
        colorShader.getMatHandler().setProjectionMatrix(ortho);
        textureShader.bind();
        textureShader.getMatHandler().setProjectionMatrix(ortho);
    }

    function looper() {
        GLF.clearBufferColor()

        renderLp();
        updateLp();
        spriteManager.render();
        requestAnimationFrame(looper);
    }

    export function getBasicShader(typ: ShaderType): Shader {
        switch (typ) {
            case ShaderType.COLOR: return colorShader;
            case ShaderType.TEXTURE: return textureShader;
        }
    }

    export enum ShaderType { COLOR, TEXTURE }

    export function createShader(typ: ShaderType): Shader {
        var shad: Shader;
        if (typ == ShaderType.COLOR) {
            shad = new Shader("plenaColorShader", { "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "color": Shader.COLOR }, shadColVertex, shadColFrag);
        } else {
            shad = new Shader("plenaTextureShader", { "projectionMatrix": Shader.PROJECTION_MATRIX, "viewMatrix": Shader.VIEW_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "UVMatrix": Shader.UV_MATRIX }, shadTexVertex, shadTexFrag);
            shad.getMatHandler().setUVMatrix(Matrix4.identity());
        }

        shad.getMatHandler().setModelMatrix(Matrix4.identity());
        shad.getMatHandler().setProjectionMatrix(Matrix4.identity());
        shad.getMatHandler().setViewMatrix(Matrix4.identity());

        return shad;
    }

    export function manager(): Manager {
        return spriteManager;
    }

    export function createManager(): Manager {
        return new Manager();
    }

    class Manager {
        private shaders = new TreeMap<string, Shader>(STRING_COMPARE);
        private grixs = new DeepTreeMap<string, Grix>(STRING_COMPARE);

        hasShader(shader: string): boolean {
            return this.shaders.contains(shader);
        }

        addShader(shader: Shader) {
            this.shaders.put(shader.getId(), shader);
        }

        getShader(key: string): Shader {
            return this.shaders.apply(key)
        }

        addGrix(key: string, grix: Grix);
        addGrix(key: Shader, grix: Grix);
        addGrix(key: string|Shader, grix: Grix) {
            this.grixs.put((typeof key == "string") ? (<string>key) : (<Shader>key).getId(), grix);
        }

        render() {
            var ittr = this.shaders.itterator();
            for (var i = 0; i < ittr.length; i++) {
                var entry = ittr[i];
                entry[1].bind();
                var grixs = this.grixs.itterator(entry[0]);
                for (var j = 0; j < grixs.length; j++) {
                    grixs[j].do_render();
                }
            }
        }
    }
}

module GLF {
    export function clearBufferColor() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    export function clearColor(color: Vec4) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }

    export function viewPort(x: number, y: number, width: number, height: number) {
        gl.viewport(x, y, width, height);
    }

    export function alphaBlend() {
        GLF.blend(true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    export function blend(enable: boolean) {
        if (enable) gl.enable(gl.BLEND);
        else gl.disable(gl.BLEND);
    }
}