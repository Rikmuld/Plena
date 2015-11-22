window.onload = function () { QuickGL.initGL(ShadowExample.setup, ShadowExample.loop, [0, 0, 0, 1]) };

var SIPERRoom: QuickGL.SIPRender;

module ShadowExample {
    var shadRoom: Shader;
    var shadTex: Shader;
    var shadCol: Shader;

    var SIPERTex: QuickGL.SIPRender;

    var texManager: TextureManager;

    var AMBIANT = 1;
    var RESOLUTION = 2;
    var LIGHTMAP = 3;
    var SHADOWMAP = 4;

    var blocks: Geometry.Rectangle[] = [];
    var shadow: Geometry.Point[][] = [];

    var lightMap: Framebuffer;
    var shadowMap: Framebuffer;

    var TEX_LIGHT = 'light'
    var TEX_LIGHT_RAW = 'light'
    var TEX_LIGHT_RAW_LOC = 'light.png'

    var shadowCoords: number[];
    var canDo = true;

    export function setup() {
        console.log("Boe")

        texManager = new TextureManager();
        texManager.loadTextureRaw(TEX_LIGHT_RAW_LOC, TEX_LIGHT_RAW, 128, false, true);
        texManager.loadTexture(TEX_LIGHT_RAW, TEX_LIGHT, 0, 0, 128, 128, false);

        shadTex = QuickGL.createShader(QuickGL.ShaderType.TEXTURE);
        shadTex.matrix.setProjectionMatrix(Matrix4.ortho(0, window.innerWidth, window.innerHeight, 0));

        shadCol = QuickGL.createShader(QuickGL.ShaderType.COLOR);
        shadCol.matrix.setProjectionMatrix(Matrix4.ortho(0, window.innerWidth, window.innerHeight, 0));

        shadRoom = new Shader({ "projectionMatrix": Shader.PROJECTION_MATRIX, "modelMatrix": Shader.MODEL_MATRIX, "color": Shader.COLOR, "ambiant": AMBIANT, "resolution": RESOLUTION, "lightMap": LIGHTMAP, "shadowMap": SHADOWMAP }, "light");
        shadRoom.setVec4(Shader.COLOR, [0.5, 0.8, 0.5, 1]);
        shadRoom.setVec4(AMBIANT, [1, 1, 1, 0.2]);
        shadRoom.setVec2(RESOLUTION, [window.innerWidth, window.innerHeight]);
        shadRoom.setInt(LIGHTMAP, 0);
        shadRoom.setInt(SHADOWMAP, 1);
        shadRoom.matrix.setProjectionMatrix(Matrix4.ortho(0, window.innerWidth, window.innerHeight, 0));
        shadRoom.matrix.setModelMatrix(Matrix4.identity());

        SIPERRoom = new QuickGL.SIPRender(shadRoom, QuickGL.StartType.MANUAL)
        SIPERTex = new QuickGL.SIPRender(shadTex, QuickGL.StartType.MANUAL)
        SIPERTex.addTexture(texManager.getTexture(TEX_LIGHT))

        lightMap = new Framebuffer(2048, 2048);
        shadowMap = new Framebuffer(2048, 2048);

        for (var i = 0; i < 2500; i++) {
            blocks.push(Geometry.rectangle(getRandomInt(250, QuickGL.width - 100), getRandomInt(0, window.innerHeight - 100), getRandomInt(0, 0) + 10, getRandomInt(0, 0) + 10));
            shadow.push(Geometry.toPoints(blocks[blocks.length - 1]));
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    export function loop() {
        render();
        update();
    }

    function render() {
        GLF.clearBufferColor();

        lightMap.startRenderTo();
        renderLightmap();
        lightMap.stopRenderTo();

        shadowMap.startRenderTo();
        renderShadowmap();
        shadowMap.stopRenderTo();

        gl.activeTexture(gl.TEXTURE0);
        lightMap.bindTexture();
        gl.activeTexture(gl.TEXTURE1);
        shadowMap.bindTexture();
        gl.activeTexture(gl.TEXTURE0);

        renderRoom();

        shadTex.bind();
        SIPERTex.drawer.start();
        lightMap.bindTexture();
        SIPERTex.rect(0, 0, 250, 250);
        shadowMap.bindTexture();
        SIPERTex.rect(0, 250, 250, 250);
        SIPERTex.drawer.end();
    }

    function renderRoom() {
        shadRoom.bind();
        SIPERRoom.drawer.start();

        SIPERRoom.setColorRGB(237, 229, 226);
        shadRoom.matrix.setModelMatrix(Matrix4.scale(window.innerWidth, 500));

        SIPERRoom.rect(0, 0, window.innerWidth, window.innerHeight);
        SIPERRoom.setColorRGB(189, 92, 81);
        for (var i = 0; i < blocks.length; i++) SIPERRoom.rect(blocks[i]);

        SIPERRoom.drawer.end();
    }

    function renderLightmap() {
        shadTex.bind();
        texManager.getTexture(TEX_LIGHT).bind();
        SIPERTex.drawer.start();
        SIPERTex.rect(Mouse.getX() - 256, Mouse.getY() - 256, 512, 512)
        SIPERTex.drawer.end();
    }

    function renderShadowmap() {
        shadCol.bind();
        shadCol.setVec4(Shader.COLOR, [1, 1, 1, 1]);

        var shadowRender = new Render();
        shadowRender.addVertexes(shadCol, shadowCoords);
        shadCol.matrix.setModelMatrix(Matrix4.translate(0, 0));

        if (shadowCoords != null) shadowRender.drawWithStartEnd(gl.TRIANGLE_FAN, shadowCoords.length / 2);
    }

    function update() {
        shadowCoords = Shadow.getShadowFan(Geometry.rectangle(Mouse.getX() - 256, Mouse.getY() - 256, 512, 512), shadow, false);

        if (Mouse.isButtonDown(0)) {
            if (canDo) {
                blocks.push(Geometry.rectangle(Mouse.getX() - 10, Mouse.getY() - 10, 20, 20));
                shadow.push(Geometry.toPoints(blocks[blocks.length-1]));
                canDo = false;
            }
        } else canDo = true;
    }
}