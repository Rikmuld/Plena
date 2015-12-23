var gl: WebGLRenderingContext;

//all textures loaded cheack and only then call render/update stuff (option)
//fullscreen option
//loader at start option
//different shader/projection for hud no view
module Plena {
    var renderLp, updateLp: (delta: number) => void;
    var canvas: HTMLCanvasElement;
    var lastTick:number;
    var doLog: boolean = true;

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

    var camera: Camera;
    var projection: Vec4;
    var projectionSave: Vec4;
    
    var canvasX: number;
    var canvasY: number;

    var totalQueue: number = 0;

    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, x: number, y: number, width: number, height: number);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, width: number, height: number);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, width: number, height: number, color: Color);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, color: Color);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, x: number, y: number, width: number, height: number, color: Color);
    export function init(setupFunc: () => void, renderLoop: (delta: number) => void, updateLoop: (delta: number) => void, p1?: number|Color, p2?: number, p3?: number|Color, p4?: number, p5?: Color) {
        var width, height, x, y: number;
        var color: number[];

        if (typeof p3 == 'number') {
            width = p3;
            height = p4;
            x = p1;
            y = p2;
            if (p5) color = (p5 as Color).vec();
            else color = [1, 1, 1, 1];
        } else if (typeof p2 == 'number') {
            width = p1;
            height = p2;
            x = window.innerWidth / 2 - width / 2;
            y = window.innerHeight / 2 - height / 2;
            if (p3) color = (p3 as Color).vec();
            else color = [1, 1, 1, 1];
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
            x = 0;
            y = 0;
            if (p1) color = (p1 as Color).vec();
            else color = [1, 1, 1, 1];
        }

        canvas = document.createElement('canvas');
        canvas.setAttribute("width", "" + width);
        canvas.setAttribute("height", "" + height);
        canvas.setAttribute("style", "position:fixed; top:" + y + "px; left:" + x + "px")
        document.body.appendChild(canvas)

        canvasX = x;
        canvasY = y;

        Plena.width = width;
        Plena.height = height;

        gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext
        
        gl.viewport(0, 0, width, height)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT)

        Keyboard.enable();
        Mouse.enable();

        colorShader = createShader(ShaderType.COLOR)
        textureShader = createShader(ShaderType.TEXTURE)

        changeProjection(0, width, height, 0)

        spriteManager = createManager();
        spriteManager.addShader(colorShader);
        spriteManager.addShader(textureShader);

        renderLp = renderLoop;
        updateLp = updateLoop;

        lastTick = Date.now();

        setupFunc();

        totalQueue = Assets.getQueue();
        if (totalQueue > 0) {
            log(`Started loading assets, total: ${totalQueue}`);
            Assets.addQueueListner(asssetsLoadStep);
        } else looper();
    }

    function asssetsLoadStep(queue: number) {
        log(`Loading Assets... progress ${totalQueue-queue}/${totalQueue} assets`);

        if (queue == 0) {
            if (Assets.hasError()) log(`Assets loading finished with errors`)
            else log(`Assets loading finished without error`)
            looper()
        }
    }

    export function log(text:string) {
        if(doLog)console.log(text);
    }

    export function suppresLog() {
        doLog = false;
    }

    export function getWidth():number {
        return mapX(width);
    }
    export function getHeight(): number {
        return mapY(height);
    }

    export function mapX(x: number): number {
        let l = projection[0];
        let r = projection[1];

        return l + (Math.abs(r - l) / width) * (x - canvasX)
    }

    export function mapY(y: number): number {
        let t = projection[3];
        let b = projection[2];

        return t + (Math.abs(b - t) / height) * (y - canvasY);
    }
   
    export function saveProjection() {
        projectionSave = projection;
    }
    export function restoreProjection() {
        changeProjection(projectionSave[0], projectionSave[1], projectionSave[2], projectionSave[3])
    }
    export function bindCameraTo(entity: Entity) {
        if (camera == null) camera = new Camera(entity);
        else camera.bindTo(entity);
    }
    export function changeCamera(camera:Camera) {
        camera = camera;
    }
    export function getCamera(): Camera {
        return camera;
    }
    export function changeProjection(left: number, bottom: number);
    export function changeProjection(left: number, right: number, bottom: number, top: number);
    export function changeProjection(left: number, right: number, bottom?: number, top?: number) {
        var ortho: Mat4;

        if (typeof bottom == 'number') {
            ortho = Matrix4.ortho(left, right, bottom, top);
            projection = [left, right, bottom, top];
        } else {
            ortho = Matrix4.ortho(0, left, right, 0);
            projection = [0, left, right, 0];
        }
        
        colorShader.bind();
        colorShader.getMatHandler().setProjectionMatrix(ortho);
        textureShader.bind();
        textureShader.getMatHandler().setProjectionMatrix(ortho);
    }

    function looper() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        var tick = Date.now();
        var delta = tick - lastTick;
        lastTick = tick;

        if (camera != null) camera.update();

        renderLp(delta);
        updateLp(delta);
        spriteManager.render();
        requestAnimationFrame(looper);
    }

    export function forceRender() {
        spriteManager.render();
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
                    grixs[j].doRenderAll();
                }
            }
        }
    }
}