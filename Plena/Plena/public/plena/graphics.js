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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Grix = (function () {
    function Grix(customShader) {
        this.mode = gl.TRIANGLES;
        this.drawer = new Render();
        this.loadedTex = false;
        this.childs = new Queue();
        this.defaultColor = [1, 1, 1, 1];
        this.xT = 0;
        this.yT = 0;
        this.sXT = 1;
        this.sYT = 1;
        this.angle = 0;
        this.pmX = 0;
        this.pmY = 0;
        this.prX = 0;
        this.prY = 0;
        this.relRotP = true;
        this.mirrorX = false;
        this.mirrorY = false;
        this.inCount = 0;
        this.drawer = new Render();
        this.minX = Math.min();
        this.minY = Math.min();
        this.maxX = Math.max();
        this.maxY = Math.max();
        if (customShader) {
            this.customeShader = customShader;
            this.matrix = this.customeShader.getMatHandler();
            if (!Plena.manager().hasShader(customShader.getId()))
                Plena.manager().addShader(customShader);
        }
    }
    Grix.prototype.populate = function () {
        if (this.verts != null) {
            this.drawer.addVertexes(this.getShader(), this.verts.toArray());
            this.drawer.addIndieces(this.indiec.toArray());
            this.height = Math.abs(this.maxY - this.minY);
            this.width = Math.abs(this.maxX - this.minX);
        }
        Plena.manager().addGrix(this.getShader(), this);
        this.isFinal = true;
        this.clean();
        return this;
    };
    Grix.prototype.start = function () {
        this.drawer.start();
    };
    Grix.prototype.end = function () {
        this.drawer.end();
    };
    Grix.prototype.addVerts = function () {
        var verts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            verts[_i - 0] = arguments[_i];
        }
        if (this.verts == null)
            this.verts = new Bag();
        this.verts.insertArray(verts);
    };
    Grix.prototype.addIndiec = function () {
        var indiec = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indiec[_i - 0] = arguments[_i];
        }
        if (this.indiec == null)
            this.indiec = new Bag();
        this.indiec.insertArray(indiec);
    };
    Grix.prototype.rect = function (width, height, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.addVerts(x, y, x + width, y, x + width, y + height, x, y + height);
        this.addIndiec(this.inCount + 0, this.inCount + 1, this.inCount + 3, this.inCount + 1, this.inCount + 2, this.inCount + 3);
        this.minX = Math.min(x, this.minX);
        this.maxX = Math.max(width + x, this.maxX);
        this.minY = Math.min(y, this.minY);
        this.maxY = Math.max(height + y, this.maxY);
        this.mode = gl.TRIANGLES;
        this.inCount += 4;
        return this;
    };
    Grix.prototype.textureRect = function (width, height) {
        this.drawer.addVertexes(this.getShader(), [0, 0, width, 0, width, height, 0, height]);
        this.drawer.addIndieces([0, 1, 3, 1, 2, 3]);
        this.width = width;
        this.height = height;
        this.mode = gl.TRIANGLES;
        return this;
    };
    Grix.prototype.line = function (x, y, x2, y2) {
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        this.addVerts(x2, y2, x + x2, y + y2);
        this.addIndiec(this.inCount + 0, this.inCount + 1);
        this.inCount += 2;
        this.minX = Math.min(this.minX, Math.min(x + x2, x2));
        this.maxX = Math.max(this.maxX, Math.max(x + x2, x2));
        this.minY = Math.min(this.minY, Math.min(y + y2, y2));
        this.maxY = Math.max(this.maxY, Math.max(y + y2, y2));
        this.mode = gl.LINES;
        return this;
    };
    Grix.prototype.circle = function (radius, parts) {
        if (parts === void 0) { parts = 35; }
        return this.ellipse(radius, radius, parts);
    };
    Grix.prototype.polygon = function (radius, corners) {
        return this.circle(radius, corners);
    };
    Grix.prototype.ellipse = function (radiusX, radiusY, parts) {
        if (parts === void 0) { parts = 30; }
        var coords = [radiusX, radiusY];
        var indicies = [0];
        for (var i = 0; i < parts + 1; i++) {
            var angle = i * ((Math.PI * 2) / parts);
            coords.push(radiusX + Math.cos(angle) * radiusX);
            coords.push(radiusY + Math.sin(angle) * radiusY);
            indicies.push(i + 1);
        }
        this.drawer.addVertexes(this.getShader(), coords);
        this.drawer.addIndieces(indicies);
        this.width = radiusX * 2;
        this.height = radiusY * 2;
        this.mode = gl.TRIANGLE_FAN;
        return this;
    };
    Grix.prototype.setColorV3 = function (color) {
        color.push(1);
        return this.setColor(color);
    };
    Grix.prototype.setColorV4 = function (color) {
        return this.setColor(color);
    };
    Grix.prototype.setColorRGB = function (r, g, b) {
        return this.setColor([r / 255, g / 255, b / 255, 1]);
    };
    Grix.prototype.setColorRBGA = function (r, g, b, a) {
        return this.setColor([r / 255, g / 255, b / 255, a / 255]);
    };
    Grix.prototype.setColor = function (color) {
        if (this.isFinal)
            this.color = color;
        else
            this.defaultColor = color;
        return this;
    };
    Grix.prototype.fromTexture = function (texture) {
        this.texture = texture;
        texture.onLoaded(this.textureLoaded(this));
        texture.onLoaded(this.mkRect(this));
        return this;
    };
    Grix.prototype.addTexture = function (texture) {
        this.texture = texture;
        texture.onLoaded(this.textureLoaded(this));
        return this;
    };
    Grix.prototype.animationFromSprite = function (sprite) {
        this.texture = sprite;
        sprite.onLoaded(this.spriteLoaded(this));
        sprite.onLoaded(this.mkRectSPA(this, sprite));
        sprite.onLoaded(this.setupAnimation(this, sprite));
        return this;
    };
    Grix.prototype.addSprite = function (sprite) {
        this.texture = sprite;
        sprite.onLoaded(this.spriteLoaded(this));
        return this;
    };
    Grix.prototype.setActiveImg = function (img) {
        if (this.isFinal)
            this.img = img;
        else
            this.defaultImg = img;
        this.anim = null;
        return this;
    };
    Grix.prototype.mkRect = function (ths) {
        return function (texture) {
            ths.textureRect(texture.getWidth(), texture.getHeight());
        };
    };
    Grix.prototype.mkRectSP = function (ths, sprite) {
        return function (texture) {
            var img = sprite.arbImg();
            ths.textureRect(img.getWidth(), img.getHeight());
            ths.populate();
        };
    };
    Grix.prototype.mkRectSPA = function (ths, sprite) {
        return function (texture) {
            var img = sprite.arbAnim()[0];
            ths.rect(img.getWidth(), img.getHeight());
            ths.populate();
        };
    };
    Grix.prototype.setupAnimation = function (ths, sprite) {
        return function (texture) {
            ths.defaultAnim = sprite.arbAnimName();
            ths.setActiveAnimation(ths.defaultAnim);
        };
    };
    Grix.prototype.textureLoaded = function (ths) {
        return function (texture) {
            ths.loadedTex = true;
            var coord = texture.getCoord();
            ths.drawer.addUVCoords(ths.getShader(), [coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
        };
    };
    Grix.prototype.spriteLoaded = function (ths) {
        return function (sprite) {
            ths.loadedTex = true;
            ths.defaultImg = ths.texture.arbImgName();
            ths.setActiveImg(ths.defaultImg);
            ths.drawer.addUVCoords(ths.getShader(), [0, 0, 1, 0, 1, 1, 0, 1]);
        };
    };
    Grix.prototype.getShader = function () {
        if (!this.customeShader) {
            if (this.texture != null)
                return Plena.getBasicShader(Plena.ShaderType.TEXTURE);
            else
                return Plena.getBasicShader(Plena.ShaderType.COLOR);
        }
        else
            return this.customeShader;
    };
    //rotating and mirroring does not work together, I made something to have the displacement of mirroring to be corected, but I did not keep the rotation into account, so only angle==0 will work with mirroring, it does work with scaling
    Grix.prototype.render = function () {
        if (this.texture != null && !this.loadedTex)
            return;
        var centerX = ((this.width * this.sXT) / 2);
        var centerY = ((this.height * this.sYT) / 2);
        var aC = Math.cos(this.angle);
        var aS = Math.sin(this.angle);
        var xTr = centerX + this.xT;
        var yTr = centerY + this.yT;
        var mX = (this.mirrorX ? -1 : 1);
        var mY = (this.mirrorY ? -1 : 1);
        var x2 = !this.relRotP ? -this.prX + this.xT : -centerX - this.prX * (centerX * 2);
        var y2 = !this.relRotP ? -this.prY + this.yT : -centerY - this.prY * (centerY * 2);
        var x3 = this.sXT * mX;
        var y3 = this.sYT * mY;
        var x1 = xTr + (this.mirrorX ? centerX * 2 : 0) + (!this.relRotP ? this.prX - xTr : this.prX * (centerX * 2)) + aC * x2 + -aS * y2;
        var y1 = yTr + (this.mirrorY ? centerY * 2 : 0) + (!this.relRotP ? this.prY - yTr : this.prY * (centerY * 2)) + aS * x2 + aC * y2;
        var transform = [aC * x3, aS * x3, 0, 0, -aS * y3, aC * y3, 0, 0, 0, 0, 1, 0, x1, y1, 0, 1];
        this.childs.enqueue(this.grixc(transform, this.color, this.img, this.anim, this.animStep));
    };
    Grix.prototype.animationStep = function (step) {
        if (this.anim == null)
            return;
        else
            this.animStep = step % this.texture.getAnim(this.anim).length;
    };
    Grix.prototype.move = function (x, y) {
        this.xT += x;
        this.yT += y;
    };
    Grix.prototype.moveTo = function (x, y) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
        this.yT = y - (this.height * this.sYT) * this.pmY;
    };
    Grix.prototype.moveXTo = function (x) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
    };
    Grix.prototype.moveYTo = function (y) {
        this.yT = y - (this.height * this.sYT) * this.pmY;
    };
    Grix.prototype.scale = function (x, y) {
        this.sXT += x;
        this.sYT += y;
    };
    Grix.prototype.scaleTo = function (x, y) {
        this.sXT = x;
        this.sYT = y;
    };
    Grix.prototype.setActiveAnimation = function (anim) {
        if (this.isFinal)
            this.anim = anim;
        else
            this.defaultAnim = anim;
        this.img = null;
        return this;
    };
    Grix.prototype.scaleToSize = function (width, height) {
        var x = width / this.width;
        var y = height / this.height;
        this.scaleTo(x, y);
    };
    Grix.prototype.scaleWidthToSize = function (width) {
        var x = width / this.width;
        this.scaleTo(x, x);
    };
    Grix.prototype.scaleHeightToSize = function (height) {
        var y = height / this.height;
        this.scaleTo(y, y);
    };
    Grix.prototype.rotate = function (angle) {
        this.angle += angle;
    };
    Grix.prototype.rotateTo = function (angle) {
        this.angle = angle;
    };
    Grix.prototype.rotateDeg = function (angle) {
        this.rotate(MMath.toRad(angle));
    };
    Grix.prototype.rotateToDeg = function (angle) {
        this.rotateTo(MMath.toRad(angle));
    };
    Grix.prototype.clean = function () {
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
    };
    Grix.prototype.grixc = function (transform, color, img, anim, animStep) {
        return { color: color, transform: transform, img: img, anim: anim, animStep: animStep };
    };
    Grix.prototype.do_render = function () {
        this.start();
        if (this.texture != null)
            this.texture.bind();
        var size = this.childs.size();
        for (var i = 0; i < size; i++) {
            var child = this.childs.dequeue();
            this.getShader().getMatHandler().setModelMatrix(child.transform); //sort childs based upon the coords maybe, less shader mat change
            if (this.texture != null && this.loadedTex == true && typeof this.texture.getCoord == "undefined") {
                if (child.anim == null && child.img == null)
                    break;
                var sprite = this.texture;
                var coords = (child.anim == null ? sprite.getImg(child.img) : sprite.getAnim(child.anim)[child.animStep]).getCoord();
                var mat = Matrix4.translate(coords.getXMin(), coords.getYMin());
                mat = Matrix4.scale(mat, coords.getXMax() - coords.getXMin(), coords.getYMax() - coords.getYMin());
                this.getShader().getMatHandler().setUVMatrix(mat);
            }
            if (this.texture == null)
                this.getShader().setVec4(Shader.COLOR, child.color);
            if ((this.texture != null && this.loadedTex == true) || this.texture == null)
                this.drawer.drawElements(0, this.mode);
        }
        this.end();
        this.clean();
        this.getShader().getMatHandler().setUVMatrix(Matrix4.identity());
    };
    Grix.prototype.mirrorHorizontal = function (mirror) {
        this.mirrorX = mirror;
    };
    Grix.prototype.mirrorVertical = function (mirror) {
        this.mirrorY = mirror;
    };
    Grix.prototype.setPivotRot = function (x, y, relative) {
        if (typeof relative == "boolean" && relative == false) {
            this.relRotP = false;
            this.prX = x;
            this.prY = y;
        }
        else {
            this.prX = x - 0.5;
            this.prY = y - 0.5;
            this.relRotP = true;
        }
    };
    Grix.prototype.setPivotMove = function (x, y) {
        this.pmX = x;
        this.pmY = y;
    };
    Grix.prototype.getWidth = function () {
        return this.width * this.sXT;
    };
    Grix.prototype.getHeight = function () {
        return this.height * this.sYT;
    };
    return Grix;
})();
var WritableGrix = (function (_super) {
    __extends(WritableGrix, _super);
    function WritableGrix(tex, customShader) {
        _super.call(this, customShader);
        this.writable = tex;
        this.fromTexture(tex.getImg());
        this.populate();
    }
    WritableGrix.prototype.startWrite = function () {
        this.writable.startWrite();
    };
    WritableGrix.prototype.endWrite = function () {
        this.writable.stopWrite();
    };
    return WritableGrix;
})(Grix);
var TextGrix = (function (_super) {
    __extends(TextGrix, _super);
    //some ort of offset x for fomnts that are close to each other
    function TextGrix(fontMap, customShader) {
        _super.call(this, customShader);
        this.yOffset = 0;
        this.xOffset = 0;
        this.addSprite(fontMap.getMap());
        this.rect(1, 1);
        this.populate();
        this.fontMap = fontMap;
    }
    TextGrix.prototype.fontsize = function (px) {
        var size = px / this.fontMap.getFont().getFontSize();
        this.scaleTo(size, size);
    };
    TextGrix.prototype.offsetY = function (offset) {
        this.yOffset = offset;
    };
    TextGrix.prototype.offsetX = function (offset) {
        this.xOffset = offset;
    };
    TextGrix.prototype.clean = function () {
        _super.prototype.clean.call(this);
        this.yOffset = 0;
        this.xOffset = 0;
    };
    TextGrix.prototype.text = function (text, maxWidth) {
        if (maxWidth === void 0) { maxWidth = -1; }
        var x = this.xT;
        var y = this.yT;
        if (maxWidth != -1) {
            var textArr = text.split(" ");
            var width = 0;
            for (var i = 0; i < textArr.length; i++) {
                var tx = textArr[i];
                if (width > 0 && width + this.length(tx) > maxWidth) {
                    width = 0;
                    this.moveXTo(x);
                    this.move(0, (this.fontMap.getDim("a")[1] + this.yOffset) * this.sYT);
                    width += this.do_text(tx + " ");
                }
                else {
                    width += this.do_text(tx + " ");
                }
            }
        }
        else {
            this.do_text(text);
        }
    };
    TextGrix.prototype.length = function (text) {
        var length = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            length += this.fontMap.getDim(char)[0] * this.sXT + this.xOffset;
        }
        return length;
    };
    TextGrix.prototype.textSplit = function (text, max, ctx) {
        var retText = [];
        var textArr = text.split(" ");
        var flag = "";
        for (var i = 0; i < textArr.length; i++) {
            if (flag.length == 0)
                flag = textArr[i];
            else {
                var subFlag = flag + " " + textArr[i];
                if (ctx.measureText(subFlag).width > max) {
                    retText.push(flag);
                    flag = textArr[i];
                }
                else
                    flag = subFlag;
            }
        }
        if (flag.length > 0)
            retText.push(flag);
        return retText;
    };
    TextGrix.prototype.do_text = function (text) {
        var dX = this.sXT;
        var dY = this.sYT;
        var widthTotal = 0;
        for (var i = 0; i < text.length; i++) {
            var a = text.charAt(i);
            if (a == " ") {
                this.move(this.fontMap.spacing() * dX + this.xOffset, 0);
                widthTotal += this.fontMap.spacing() * dX + this.xOffset;
            }
            else {
                var dim = this.fontMap.getDim(a);
                var height = dim[1];
                var width = dim[0];
                this.setActiveImg(a);
                this.scaleToSize(width * dX, height * dY);
                this.render();
                this.move(width * dX + this.xOffset, 0);
                widthTotal += width * dX + this.xOffset;
            }
        }
        this.scaleTo(dX, dY);
        return widthTotal;
    };
    return TextGrix;
})(Grix);
var Shader = (function () {
    function Shader(id, shaderVars, p2, p3) {
        this.programId = 0;
        this.shadVarData = Array(0);
        this.id = id;
        var fragmentShader, vertexShader;
        if (typeof p3 == 'undefined') {
            fragmentShader = this.getShader(p2 + "-fs");
            vertexShader = this.getShader(p2 + "-vs");
        }
        else {
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
    Shader.prototype.getId = function () {
        return this.id;
    };
    Shader.prototype.getVerticesLoc = function () {
        return this.vertices;
    };
    Shader.prototype.getUVLoc = function () {
        return this.UVCoords;
    };
    Shader.prototype.getMatHandler = function () {
        return this.matrix;
    };
    Shader.prototype.bind = function () {
        gl.useProgram(this.programId);
    };
    Shader.prototype.setMatrix4 = function (shadVar, matrix) {
        gl.uniformMatrix4fv(this.shadVarData[shadVar], false, matrix);
    };
    Shader.prototype.setInt = function (shadVar, num) {
        gl.uniform1i(this.shadVarData[shadVar], num);
    };
    Shader.prototype.setFloat = function (shadVar, num) {
        gl.uniformf(this.shadVarData[shadVar], num);
    };
    Shader.prototype.setVec2 = function (shadVar, vec2) {
        gl.uniform2f(this.shadVarData[shadVar], vec2[0], vec2[1]);
    };
    Shader.prototype.setVec3 = function (shadVar, vec3) {
        gl.uniform3f(this.shadVarData[shadVar], vec3[0], vec3[1], vec3[2]);
    };
    Shader.prototype.setVec4 = function (shadVar, vec4) {
        gl.uniform4f(this.shadVarData[shadVar], vec4[0], vec4[1], vec4[2], vec4[3]);
    };
    Shader.prototype.createShader = function (data, shaderType) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, data);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    Shader.prototype.getShader = function (id) {
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
            return this.createShader(theSource, gl.FRAGMENT_SHADER);
        }
        else if (shaderScript.type == "x-shader/x-vertex") {
            return this.createShader(theSource, gl.VERTEX_SHADER);
        }
        else {
            return null;
        }
    };
    Shader.PROJECTION_MATRIX = 100;
    Shader.VIEW_MATRIX = 101;
    Shader.MODEL_MATRIX = 102;
    Shader.UV_MATRIX = 103;
    Shader.COLOR = 104;
    return Shader;
})();
var MatrixHandler = (function () {
    function MatrixHandler(shader) {
        this.projMat = Matrix4.identity();
        this.viewMat = Matrix4.identity();
        this.shader = shader;
    }
    MatrixHandler.prototype.setProjectionMatrix = function (matrix) {
        this.shader.setMatrix4(Shader.PROJECTION_MATRIX, matrix);
        this.projMat = matrix;
    };
    MatrixHandler.prototype.setModelMatrix = function (matrix) {
        this.shader.setMatrix4(Shader.MODEL_MATRIX, matrix);
    };
    MatrixHandler.prototype.setViewMatrix = function (matrix) {
        this.shader.setMatrix4(Shader.VIEW_MATRIX, matrix);
        this.viewMat = matrix;
    };
    MatrixHandler.prototype.setUVMatrix = function (matrix) {
        this.shader.setMatrix4(Shader.UV_MATRIX, matrix);
    };
    return MatrixHandler;
})();
var Render = (function () {
    function Render() {
        this.attrpBuffs = new Array(0);
        this.attrpIds = new Array(0);
        this.elementBuff = new Array(0);
        this.count = new Array(0);
    }
    Render.prototype.addAttrips = function (attripBuff, id) {
        this.attrpBuffs.push(attripBuff);
        this.attrpIds.push(id);
    };
    Render.prototype.addToEnd = function (elementBuff, count) {
        this.elementBuff.push(elementBuff);
        this.count.push(count);
    };
    Render.prototype.addVertexes = function (shader, vertices) {
        var buff = gl.createBuffer();
        var id = shader.getVerticesLoc();
        this.shader = shader;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(id, 2, gl.FLOAT, false, 0, 0);
        this.addAttrips(buff, id);
    };
    Render.prototype.addUVCoords = function (shader, coords) {
        var buff = gl.createBuffer();
        var id = shader.getUVLoc();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(id, 2, gl.FLOAT, false, 0, 0);
        this.addAttrips(buff, id);
    };
    Render.prototype.addIndieces = function (indieces) {
        var count = indieces.length;
        var elementBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indieces), gl.STATIC_DRAW);
        this.addToEnd(elementBuff, count);
    };
    Render.prototype.switchBuff = function (id) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
    };
    Render.prototype.draw = function (typ, count) {
        gl.drawArray(typ, 0, count);
    };
    Render.prototype.drawElements = function (id, typ) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
        gl.drawElements(typ, this.count[id], gl.UNSIGNED_SHORT, 0);
    };
    Render.prototype.drawSomeElements = function (ids, typ) {
        for (var id = 0; id < ids.length; id++) {
            if (ids[id]) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuff[id]);
                gl.drawElements(typ, this.count[id], gl.UNSIGNED_SHORT, 0);
            }
        }
    };
    Render.prototype.start = function () {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.enableVertexAttribArray(this.attrpIds[i]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attrpBuffs[i]);
            gl.vertexAttribPointer(this.attrpIds[i], 2, gl.FLOAT, false, 0, 0);
        }
    };
    Render.prototype.end = function () {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.disableVertexAttribArray(this.attrpIds[i]);
        }
    };
    Render.prototype.drawElementsWithStartEnd = function (typ, id) {
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
    };
    Render.prototype.drawWithStartEnd = function (typ, count) {
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.enableVertexAttribArray(this.attrpIds[i]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attrpBuffs[i]);
            gl.vertexAttribPointer(this.attrpIds[i], 2, gl.FLOAT, false, 0, 0);
        }
        gl.drawArrays(typ, 0, count);
        for (var i = 0; i < this.attrpIds.length; i++) {
            gl.disableVertexAttribArray(this.attrpIds[i]);
        }
    };
    return Render;
})();
var Framebuffer = (function () {
    function Framebuffer(sizeX, sizeY, smooth, repeat) {
        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeX, sizeY, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, smooth ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, smooth ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST_MIPMAP_NEAREST);
        if (repeat)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        this.frameBuffer.width = sizeX;
        this.frameBuffer.height = sizeY;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    Framebuffer.prototype.getTexture = function () {
        return this.frameTexture;
    };
    Framebuffer.prototype.startRenderTo = function () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.frameBuffer.width, this.frameBuffer.height);
    };
    Framebuffer.prototype.stopRenderTo = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, Plena.width, Plena.height);
    };
    Framebuffer.prototype.bindTexture = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    };
    return Framebuffer;
})();
//# sourceMappingURL=graphics.js.map