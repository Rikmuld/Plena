//more draw modes (not fill shape but only a border, or a shape witha border, different colors, gradients etc..)
//font
//maybe key over or click events
//enable compound for all ellipses
//add curves
//texture mapping for shapes
//self made shape with moveto (also texture mapping)
//canvas driven graphix as alternative
//fix render
//test time of canvas driven render vs grix

class Grix {
    private mode = gl.TRIANGLES;
    private customeShader: Shader;
    private matrix: MatrixHandler;
    private drawer = new Render();
    private texture: Img|Sprite;
    private loadedTex = false;
    protected isFinal: boolean;
    private childs = new Queue<GrixC>();
    private width: number;
    private height: number;
    private defaultColor: Vec4 = [1, 1, 1, 1];
    private color: Vec4;
    private defaultImg: string;
    private img: string;
    private defaultAnim: string;
    private anim: string;
    private animStep: number;
    protected xT: number = 0;
    protected yT: number = 0;
    protected sXT: number = 1;
    protected sYT: number = 1;
    private angle: number = 0;
    private pmX: number = 0;
    private pmY: number = 0;
    private prX: number = 0;
    private prY: number = 0;
    private relRotP: boolean = true;
    private mirrorX: boolean = false;
    private mirrorY: boolean = false;
    private verts:Bag<number>;
    private indiec: Bag<number>;
    private inCount = 0;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    constructor(customShader?: Shader) {
        this.drawer = new Render();
        this.minX = Math.min();
        this.minY = Math.min();
        this.maxX = Math.max();
        this.maxY = Math.max();

        if (customShader) {
            this.customeShader = customShader;
            this.matrix = this.customeShader.getMatHandler();
            if (!Plena.manager().hasShader(customShader.getId())) Plena.manager().addShader(customShader);
        }
    }
    populate(): Grix {
        if (this.verts != null) {
            this.drawer.addVertexes(this.getShader(), this.verts.toArray());
            this.drawer.addIndieces(this.indiec.toArray());

            this.height = Math.abs(this.maxY - this.minY)
            this.width = Math.abs(this.maxX - this.minX)
        }
        Plena.manager().addGrix(this.getShader(), this);
        this.isFinal = true;
        this.clean();
        return this;
    }
    start() {
        this.drawer.start();
    }
    end() {
        this.drawer.end();
    }
    addVerts(...verts: number[]) {
        if (this.verts == null) this.verts = new Bag<number>();
        this.verts.insertArray(verts);
    }
    addIndiec(...indiec: number[]) {
        if (this.indiec == null) this.indiec = new Bag<number>();
        this.indiec.insertArray(indiec);
    }
    rect(width: number, height: number, x = 0, y = 0): Grix {
        this.addVerts(x, y, x + width, y, x + width, y + height, x, y + height);
        this.addIndiec(this.inCount + 0, this.inCount + 1, this.inCount + 3, this.inCount + 1, this.inCount + 2, this.inCount + 3);
        this.minX = Math.min(x, this.minX);
        this.maxX = Math.max(width + x, this.maxX);
        this.minY = Math.min(y, this.minY);
        this.maxY = Math.max(height + y, this.maxY);
        this.mode = gl.TRIANGLES;
        this.inCount += 4;
        return this;
    }
    private textureRect(width:number, height:number) {
        this.drawer.addVertexes(this.getShader(), [0, 0, width, 0, width, height, 0, height]);
        this.drawer.addIndieces([0, 1, 3, 1, 2, 3]);
        this.width = width;
        this.height = height;
        this.mode = gl.TRIANGLES;
        return this;
    }
    line(x: number, y: number, x2: number = 0, y2: number = 0): Grix {
        this.addVerts(x2, y2, x + x2, y + y2);
        this.addIndiec(this.inCount + 0, this.inCount + 1);
        this.inCount += 2;
        this.minX = Math.min(this.minX, Math.min(x + x2, x2));
        this.maxX = Math.max(this.maxX, Math.max(x + x2, x2));
        this.minY = Math.min(this.minY, Math.min(y + y2, y2));
        this.maxY = Math.max(this.maxY, Math.max(y + y2, y2));
        this.mode = gl.LINES;
        return this;
    }
    circle(radius: number, parts: number = 35): Grix {
        return this.ellipse(radius, radius, parts);
    }
    polygon(radius: number, corners: number): Grix {
        return this.circle(radius, corners);
    }
    ellipse(radiusX: number, radiusY: number, parts: number = 30):Grix {
        var coords = [radiusX, radiusY];
        var indicies = [0];
        for (var i = 0; i < parts + 1; i++) {
            var angle = i * ((Math.PI * 2) / parts);
            coords.push(radiusX + Math.cos(angle) * radiusX);
            coords.push(radiusY + Math.sin(angle) * radiusY);
            indicies.push(i+1);
        }
        this.drawer.addVertexes(this.getShader(), coords);
        this.drawer.addIndieces(indicies);
        this.width = radiusX * 2;
        this.height = radiusY * 2;
        this.mode = gl.TRIANGLE_FAN;
        return this;
    }
    setColorV3(color: number[]): Grix {
        color.push(1);
        return this.setColor(color);
    }
    setColorV4(color: number[]): Grix {
        return this.setColor(color);
    }
    setColorRGB(r: number, g: number, b: number): Grix {
        return this.setColor([r / 255, g / 255, b / 255, 1])
    }
    setColorRBGA(r: number, g: number, b: number, a: number): Grix {
        return this.setColor([r / 255, g / 255, b / 255, a / 255]);
    }
    private setColor(color: Vec4):Grix {
        if (this.isFinal) this.color = color;
        else this.defaultColor = color;
        return this;
    }
    fromTexture(texture: Img):Grix {
        this.texture = texture;

        texture.onLoaded(this.textureLoaded(this));
        texture.onLoaded(this.mkRect(this));

        return this;
    }
    addTexture(texture: Img):Grix {
        this.texture = texture;
        texture.onLoaded(this.textureLoaded(this));
        return this;
    }
    animationFromSprite(sprite: Sprite):Grix {
        this.texture = sprite;

        sprite.onLoaded(this.spriteLoaded(this));
        sprite.onLoaded(this.mkRectSPA(this, sprite))
        sprite.onLoaded(this.setupAnimation(this, sprite))

        return this;
    }
    addSprite(sprite: Sprite):Grix {
        this.texture = sprite;
        sprite.onLoaded(this.spriteLoaded(this));
        return this;
    }
    setActiveImg(img: string): Grix {
        if (this.isFinal) this.img = img;
        else this.defaultImg = img;

        this.anim = null;
        return this;
    }
    private mkRect(ths: Grix): (texture: Img) => void {
        return function (texture: Img) {
            ths.textureRect(texture.getWidth(), texture.getHeight())
        }
    }
    private mkRectSP(ths: Grix, sprite: Sprite): (texture: Img) => void {
        return function (texture: Img) {
            var img = sprite.arbImg();
            ths.textureRect(img.getWidth(), img.getHeight())
            ths.populate();
        }
    }
    private mkRectSPA(ths: Grix, sprite: Sprite): (texture: Img) => void {
        return function (texture: Img) {
            var img = sprite.arbAnim()[0];
            ths.rect(img.getWidth(), img.getHeight());
            ths.populate();
        }
    }
    private setupAnimation(ths: Grix, sprite: Sprite): (texture: Img) => void {
        return function (texture: Img) {
            ths.defaultAnim = sprite.arbAnimName();
            ths.setActiveAnimation(ths.defaultAnim);
        }
    }
    private textureLoaded(ths: Grix): (texture: Img) => void {
        return function (texture: Img) {
            ths.loadedTex = true;
            var coord = texture.getCoord();
            ths.drawer.addUVCoords(ths.getShader(), [coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
        }
    }
    private spriteLoaded(ths: Grix): (sprite: Img) => void {
        return function (sprite: Img) {
            ths.loadedTex = true;
            ths.defaultImg = (<Sprite>ths.texture).arbImgName();
            ths.setActiveImg(ths.defaultImg);
            ths.drawer.addUVCoords(ths.getShader(), [0, 0, 1, 0, 1, 1, 0, 1]);
        }
    }
    getShader(): Shader {
        if (!this.customeShader) {
            if (this.texture != null) return Plena.getBasicShader(Plena.ShaderType.TEXTURE);
            else return Plena.getBasicShader(Plena.ShaderType.COLOR);
        } else return this.customeShader;
    }
    //rotating and mirroring does not work together, I made something to have the displacement of mirroring to be corected, but I did not keep the rotation into account, so only angle==0 will work with mirroring, it does work with scaling
    render() {
        if (this.texture != null && !this.loadedTex) return;

        var centerX = ((this.width * this.sXT) / 2);
        var centerY = ((this.height * this.sYT) / 2);

        var aC = Math.cos(this.angle)
        var aS = Math.sin(this.angle)
        var xTr = centerX + this.xT;
        var yTr = centerY + this.yT;

        var mX = (this.mirrorX ? -1 : 1);
        var mY = (this.mirrorY ? -1 : 1);

        var x2 = !this.relRotP ? - this.prX + this.xT : - centerX - this.prX * (centerX * 2);
        var y2 = !this.relRotP ? -this.prY + this.yT : - centerY - this.prY * (centerY * 2);
        var x3 = this.sXT * mX;
        var y3 = this.sYT * mY;
        var x1 = xTr + (this.mirrorX ? centerX * 2 : 0) + (!this.relRotP ? this.prX - xTr : this.prX * (centerX * 2)) + aC * x2 + -aS * y2;
        var y1 = yTr + (this.mirrorY ? centerY * 2 : 0) + (!this.relRotP ? this.prY - yTr : this.prY * (centerY * 2)) + aS * x2 + aC * y2;
         
        var transform = [aC * x3, aS * x3, 0, 0, -aS * y3, aC * y3, 0, 0, 0, 0, 1, 0, x1, y1, 0, 1];

        this.childs.enqueue(this.grixc(transform, this.color, this.img, this.anim, this.animStep));
    }
    animationStep(step: number) {
        if (this.anim == null) return;
        else this.animStep = step % (<Sprite>this.texture).getAnim(this.anim).length;
    }
    move(x: number, y: number) {
        this.xT += x;
        this.yT += y;
    }
    moveTo(x: number, y: number) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
        this.yT = y - (this.height * this.sYT) * this.pmY;
    }
    moveXTo(x: number) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
    }
    moveYTo(y: number) {
        this.yT = y - (this.height * this.sYT) * this.pmY;
    }
    scale(x: number, y: number) {
        this.sXT += x;
        this.sYT += y;
    }
    scaleTo(x: number, y: number) {
        this.sXT = x;
        this.sYT = y;
    }
    setActiveAnimation(anim: string) {
        if (this.isFinal) this.anim = anim;
        else this.defaultAnim = anim;

        this.img = null;
        return this;
    }
    scaleToSize(width: number, height: number) {
        var x = width / this.width;
        var y = height / this.height;
        this.scaleTo(x, y);
    }
    scaleWidthToSize(width: number) {
        var x = width / this.width;
        this.scaleTo(x, x);
    }
    scaleHeightToSize(height: number) {
        var y = height / this.height;
        this.scaleTo(y, y);
    }
    rotate(angle: number) {
        this.angle += angle;
    }
    rotateTo(angle: number) {
        this.angle = angle;
    }
    rotateDeg(angle: number) {
        this.rotate(MMath.toRad(angle));
    }
    rotateToDeg(angle: number) {
        this.rotateTo(MMath.toRad(angle));
    }
    clean() {
        this.xT = 0;
        this.yT = 0;
        this.prY = 0;
        this.prX = 0;
        this.pmY = 0;
        this.pmX = 0;
        this.sXT = 1;
        this.sYT = 1;
        this.angle = 0;
        this.anim = this.defaultAnim;
        this.animStep = 0;
        this.color = this.defaultColor;
        this.img = this.defaultImg;
        this.relRotP = true;
        this.mirrorX = false;
        this.mirrorY = false;
    }
    private grixc(transform: Mat4, color: Vec4, img:string, anim:string, animStep:number): GrixC {
        return { color: color, transform: transform, img:img, anim:anim, animStep:animStep };
    }
    do_render() {
        this.start();
        if (this.texture != null) this.texture.bind()
        var size = this.childs.size();
        for (var i = 0; i < size; i++) {
            var child = this.childs.dequeue();
            this.getShader().getMatHandler().setModelMatrix(child.transform); //sort childs based upon the coords maybe, less shader mat change
            if (this.texture != null && this.loadedTex == true && typeof (<Img>this.texture).getCoord == "undefined") {
                if (child.anim == null && child.img == null) break;
                var sprite = (<Sprite>this.texture)
                var coords = (child.anim == null ? sprite.getImg(child.img) : sprite.getAnim(child.anim)[child.animStep]).getCoord();
                var mat = Matrix4.translate(coords.getXMin(), coords.getYMin());
                mat = Matrix4.scale(mat, coords.getXMax() - coords.getXMin(), coords.getYMax() - coords.getYMin());
                this.getShader().getMatHandler().setUVMatrix(mat);
            }
            if (this.texture == null) this.getShader().setVec4(Shader.COLOR, child.color)
            if ((this.texture != null && this.loadedTex == true) || this.texture == null) this.drawer.drawElements(0, this.mode)
        }
        this.end();
        this.clean();
        this.getShader().getMatHandler().setUVMatrix(Matrix4.identity());
    }
    mirrorHorizontal(mirror: boolean) {
        this.mirrorX = mirror;
    }
    mirrorVertical(mirror: boolean) {
        this.mirrorY = mirror;
    }
    setPivotRot(x: number, y: number, relative?: boolean) {
        if (typeof relative == "boolean" && relative == false) {
            this.relRotP = false;
            this.prX = x;
            this.prY = y;
        } else {
            this.prX = x - 0.5;
            this.prY = y - 0.5;
            this.relRotP = true;
        }
    }
    setPivotMove(x: number, y: number) {
        this.pmX = x;
        this.pmY = y;
    }
    getWidth(): number {
        return this.width * this.sXT;
    }
    getHeight(): number {
        return this.height * this.sYT
    }
}

interface GrixC {
    color: Vec4;
    img: string;
    anim: string;
    animStep: number;
    transform: Mat4;
}

class WritableGrix extends Grix {
    private writable: WritableTexture;

    constructor(tex: WritableTexture, customShader?: Shader) {
        super(customShader);
        this.writable = tex;
        this.fromTexture(tex.getImg())
        this.populate();
    }

    startWrite() {
        this.writable.startWrite();
    }

    endWrite() {
        this.writable.stopWrite();
    }
}

class TextGrix extends Grix {
    private fontMap: FontMap;
    private yOffset: number = 0;
    private xOffset: number = 0;

    //some ort of offset x for fomnts that are close to each other
    constructor(fontMap: FontMap, customShader?: Shader) {
        super(customShader);
        this.addSprite(fontMap.getMap());
        this.rect(1, 1);
        this.populate();

        this.fontMap = fontMap;
    }

    fontsize(px: number) {
        var size = px / this.fontMap.getFont().getFontSize();
        this.scaleTo(size, size);
    }

    offsetY(offset: number) {
        this.yOffset = offset;
    }

    offsetX(offset: number) {
        this.xOffset = offset;
    }

    clean() {
        super.clean();
        this.yOffset = 0;
        this.xOffset = 0;
    }

    text(text: string, maxWidth: number = -1) {
        var x = this.xT;
        var y = this.yT;

        if (maxWidth != -1) {
            var textArr = text.split(" ");
            var width = 0;
            
            for (var i = 0; i < textArr.length; i++) {
                var tx = textArr[i];

                if (width > 0 && width + this.length(tx) > maxWidth) {
                    width = 0;
                    this.moveXTo(x)
                    this.move(0, (this.fontMap.getDim("a")[1] + this.yOffset) * this.sYT)
                    width += this.do_text(tx + " ");
                } else {
                    width += this.do_text(tx + " ");
                }               
            }
        } else {
            this.do_text(text);
        }
    }

    private length(text: string): number {
        var length = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            length += this.fontMap.getDim(char)[0] * this.sXT + this.xOffset;
        }
        return length;
    }

    private textSplit(text: string, max: number, ctx: CanvasRenderingContext2D): string[] {
        var retText: string[] = [];

        var textArr = text.split(" ");
        var flag = "";

        for (var i = 0; i < textArr.length; i++) {
            if (flag.length == 0) flag = textArr[i];
            else {
                var subFlag = flag + " " + textArr[i];
                if (ctx.measureText(subFlag).width > max) {
                    retText.push(flag);
                    flag = textArr[i];
                } else flag = subFlag;
            }
        }
        if (flag.length > 0) retText.push(flag);

        return retText;
    }

    private do_text(text: string): number {
        var dX = this.sXT;
        var dY = this.sYT;

        var widthTotal = 0;
        for (var i = 0; i < text.length; i++) {
            var a = text.charAt(i);
            if (a == " ") {
                this.move(this.fontMap.spacing() * dX + this.xOffset, 0);
                widthTotal += this.fontMap.spacing() * dX + this.xOffset;
            } else {
                var dim = this.fontMap.getDim(a);
                var height = dim[1];
                var width = dim[0];

                this.setActiveImg(a);
                this.scaleToSize(width * dX, height * dY)
                this.render();
                this.move(width * dX + this.xOffset, 0);
                widthTotal += width * dX + this.xOffset;
            }
        }

        this.scaleTo(dX, dY);
        return widthTotal;
    }
}

class Shader {
    static PROJECTION_MATRIX: number = 100;
    static VIEW_MATRIX: number = 101;
    static MODEL_MATRIX: number = 102;
    static UV_MATRIX: number = 103;
    static COLOR: number = 104;

    private programId: number = 0;

    private vertices: number;
    private UVCoords: number;

    private shadVarData: number[] = Array(0);

    private matrix: MatrixHandler;
    private id;

    constructor(id: string, shaderVars: {}, vertex: string, fragment: string);
    constructor(id: string, shaderVars: {}, name: string);
    constructor(id: string, shaderVars: {}, p2: string, p3?: string) {
        this.id = id;

        var fragmentShader, vertexShader;
        if (typeof p3 == 'undefined') {
            fragmentShader = this.getShader(p2 + "-fs");
            vertexShader = this.getShader(p2 + "-vs");
        } else {
            fragmentShader = this.createShader(p3, gl.FRAGMENT_SHADER);
            vertexShader = this.createShader(p2, gl.VERTEX_SHADER);
        }

        this.programId = gl.createProgram();
        gl.attachShader(this.programId, vertexShader);
        gl.attachShader(this.programId, fragmentShader);
        gl.linkProgram(this.programId);

        if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }
        this.bind();

        this.vertices = gl.getAttribLocation(this.programId, "vertexPos");
        this.UVCoords = gl.getAttribLocation(this.programId, "vertexUV");

        for (var key in shaderVars) {
            if (shaderVars.hasOwnProperty(key)) {
                this.shadVarData[shaderVars[key]] = gl.getUniformLocation(this.programId, key);
            }
        }

        this.matrix = new MatrixHandler(this);
    }

    getId(): string {
        return this.id;
    }

    getVerticesLoc() {
        return this.vertices;
    }

    getUVLoc() {
        return this.UVCoords;
    }

    getMatHandler(): MatrixHandler {
        return this.matrix;
    }

    bind() {
        gl.useProgram(this.programId);
    }

    setMatrix4(shadVar: number, matrix: number[]) {
        gl.uniformMatrix4fv(this.shadVarData[shadVar], false, matrix);
    }

    setInt(shadVar: number, num: number) {
        gl.uniform1i(this.shadVarData[shadVar], num);
    }

    setFloat(shadVar: number, num: number[]) {
        gl.uniformf(this.shadVarData[shadVar], num);
    }

    setVec2(shadVar: number, vec2: number[]) {
        gl.uniform2f(this.shadVarData[shadVar], vec2[0], vec2[1]);
    }

    setVec3(shadVar: number, vec3: number[]) {
        gl.uniform3f(this.shadVarData[shadVar], vec3[0], vec3[1], vec3[2]);
    }

    setVec4(shadVar: number, vec4: number[]) {
        gl.uniform4f(this.shadVarData[shadVar], vec4[0], vec4[1], vec4[2], vec4[3]);
    }

    private createShader(data: string, shaderType) {
        var shader = gl.createShader(shaderType)
        gl.shaderSource(shader, data);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    private getShader(id: string) {
        var shaderScript, theSource, currentChild, shader;

        shaderScript = document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        theSource = "";
        currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == currentChild.TEXT_NODE) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        if (shaderScript.type == "x-shader/x-fragment") {
            return this.createShader(theSource, gl.FRAGMENT_SHADER)
        } else if (shaderScript.type == "x-shader/x-vertex") {
            return this.createShader(theSource, gl.VERTEX_SHADER)
        } else {
            return null;
        }
    }
}

class MatrixHandler {
    private shader: Shader;
    private projMat = Matrix4.identity();
    private viewMat = Matrix4.identity();

    constructor(shader: Shader) {
        this.shader = shader;
    }

    setProjectionMatrix(matrix) {
        this.shader.setMatrix4(Shader.PROJECTION_MATRIX, matrix)
        this.projMat = matrix;
    }

    setModelMatrix(matrix) {
        this.shader.setMatrix4(Shader.MODEL_MATRIX, matrix)
    }

    setViewMatrix(matrix) {
        this.shader.setMatrix4(Shader.VIEW_MATRIX, matrix)
        this.viewMat = matrix;
    }

    setUVMatrix(matrix) {
        this.shader.setMatrix4(Shader.UV_MATRIX, matrix)
    }
}

class Render {
    private attrpBuffs: WebGLBuffer[] = new Array(0);
    private attrpIds: WebGLBuffer[] = new Array(0);

    private elementBuff: WebGLBuffer[] = new Array(0);
    private count = new Array(0);

    private shader: Shader;

    addAttrips(attripBuff: WebGLBuffer, id) {
        this.attrpBuffs.push(attripBuff);
        this.attrpIds.push(id);
    }
    private addToEnd(elementBuff: WebGLBuffer, count: number) {
        this.elementBuff.push(elementBuff);
        this.count.push(count);
    }
    addVertexes(shader: Shader, vertices: number[]) {
        var buff = gl.createBuffer();
        var id = shader.getVerticesLoc();
        this.shader = shader;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(id, 2, gl.FLOAT, false, 0, 0);

        this.addAttrips(buff, id);
    }
    addUVCoords(shader: Shader, coords: number[]) {
        var buff = gl.createBuffer();
        var id = shader.getUVLoc();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(id, 2, gl.FLOAT, false, 0, 0);

        this.addAttrips(buff, id);
    }
    addIndieces(indieces: number[]) {
        var count = indieces.length;
        var elementBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indieces), gl.STATIC_DRAW);

        this.addToEnd(elementBuff, count);
    }
    switchBuff(id: number) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
    }
    draw(typ, count: number) {
        gl.drawArray(typ, 0, count);
    }
    drawElements(id: number, typ) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
        gl.drawElements(typ, this.count[id], gl.UNSIGNED_SHORT, 0);
    }
    drawSomeElements(ids: number[], typ) {
        for (var id = 0; id < ids.length; id++) {
            if (ids[id]) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
                gl.drawElements(typ, this.count[id], gl.UNSIGNED_SHORT, 0);
            }
        }
    }
    start() {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.enableVertexAttribArray(this.attrpIds[i]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attrpBuffs[i]);
            gl.vertexAttribPointer(this.attrpIds[i], 2, gl.FLOAT, false, 0, 0);
        }
    }
    end() {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.disableVertexAttribArray(this.attrpIds[i]);
        }
    }
    drawElementsWithStartEnd(typ, id: number) {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.enableVertexAttribArray(this.attrpIds[i]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attrpBuffs[i]);
            gl.vertexAttribPointer(this.attrpIds[i], 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
        gl.drawElements(typ, this.count[id], gl.UNSIGNED_SHORT, 0);

        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.disableVertexAttribArray(this.attrpIds[i]);
        }
    }

    drawWithStartEnd(typ, count: number) {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.enableVertexAttribArray(this.attrpIds[i]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attrpBuffs[i]);
            gl.vertexAttribPointer(this.attrpIds[i], 2, gl.FLOAT, false, 0, 0);
        }

        gl.drawArrays(typ, 0, count);

        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.disableVertexAttribArray(this.attrpIds[i]);
        }
    }
}

class Framebuffer {
    private frameBuffer;
    private frameTexture;

    constructor(sizeX:number, sizeY:number, smooth?:boolean, repeat?:boolean){
        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeX, sizeY, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, smooth ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, smooth ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST_MIPMAP_NEAREST);
        if (repeat) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        this.frameBuffer.width = sizeX;
        this.frameBuffer.height = sizeY;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    getTexture(): WebGLTexture {
        return this.frameTexture;
    }

    startRenderTo() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.frameBuffer.width, this.frameBuffer.height);
    }

    stopRenderTo() {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, Plena.width, Plena.height);
    }

    bindTexture() {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    }
}