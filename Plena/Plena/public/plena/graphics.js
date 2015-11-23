//multiple sprite animations
//sprite animations and img same time
//mirror l/r t/d
//more shapes
//more draw modes
//maybe key over or click events
var Grix = (function () {
    function Grix(customShader) {
        this.drawer = new Render();
        this.loadedTex = false;
        this.childs = new Queue();
        this.currAnim = -1;
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
        this.drawer = new Render();
        if (customShader) {
            this.customeShader = customShader;
            this.matrix = this.customeShader.getMatHandler();
            if (!Plena.manager().hasShader(customShader.getId()))
                Plena.manager().addShader(customShader);
        }
    }
    Grix.prototype.populate = function () {
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
    Grix.prototype.rect = function (width, height) {
        this.drawer.addVertexes(this.getShader(), [0, 0, width, 0, width, height, 0, height]);
        this.drawer.addIndieces([0, 1, 3, 1, 2, 3]);
        this.width = width;
        this.height = height;
        return this;
    };
    Grix.prototype.colorV3 = function (color) {
        color.push(1);
        return this.setColor(color);
    };
    Grix.prototype.colorV4 = function (color) {
        return this.setColor(color);
    };
    Grix.prototype.colorRGB = function (r, g, b) {
        return this.setColor([r / 255, g / 255, b / 255, 1]);
    };
    Grix.prototype.colorRBGA = function (r, g, b, a) {
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
        sprite.onLoaded(this.mkRectSP(this, sprite));
        sprite.onLoaded(this.setupAnimation(this, sprite));
        return this;
    };
    Grix.prototype.addAnimation = function (ids) {
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
        return this;
    };
    Grix.prototype.mkRect = function (ths) {
        return function (texture) {
            ths.rect(texture.getWidth(), texture.getHeight());
        };
    };
    Grix.prototype.mkRectSP = function (ths, sprite) {
        return function (texture) {
            var img = sprite.getArbImg();
            ths.rect(img.getWidth(), img.getHeight());
        };
    };
    Grix.prototype.setupAnimation = function (ths, sprite) {
        return function (texture) {
            ths.animation = sprite.getImgNames();
            ths.currAnim = 0;
            console.log("animation setup");
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
            ths.defaultImg = ths.texture.getArbImg().getId();
            ths.drawer.addUVCoords(ths.getShader(), [0, 0, 1, 0, 1, 1, 0, 1]);
            console.log("hallo2");
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
    Grix.prototype.render = function () {
        if (this.texture != null && !this.loadedTex)
            return;
        var transform = Matrix4.identity();
        var centerX = ((this.width * this.sXT) / 2);
        var centerY = ((this.height * this.sYT) / 2);
        if (this.angle != 0)
            transform = Matrix4.translate(transform, centerX, centerY);
        if (this.xT != 0 || this.yT != 0)
            transform = Matrix4.translate(transform, this.xT + (this.mirrorX ? centerX * 2 : 0), this.yT + +(this.mirrorY ? centerY * 2 : 0));
        if (this.angle != 0) {
            transform = Matrix4.translate(transform, !this.relRotP ? this.prX - this.xT - centerX : this.prX * (centerX * 2), !this.relRotP ? this.prY - this.yT - centerY : this.prY * (centerY * 2));
            transform = Matrix4.rotate(transform, this.angle);
            transform = Matrix4.translate(transform, !this.relRotP ? -this.prX + this.xT : -this.prX * (centerX * 2), !this.relRotP ? -this.prY + this.yT : -this.prY * (centerY * 2));
        }
        if (this.sXT != 1 || this.sYT != 1)
            transform = Matrix4.scale(transform, this.sXT * (this.mirrorX ? -1 : 1), this.sYT * (this.mirrorY ? -1 : 1));
        this.childs.enqueue(this.grixc(transform, this.color, this.img, this.currAnim == -1 ? null : this.animation[this.currAnim]));
    };
    Grix.prototype.animationStep = function (step) {
        if (this.animation == null)
            return;
        else
            this.currAnim = step % this.animation.length;
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
        this.currAnim = this.animation == null ? -1 : 0;
        this.color = this.defaultColor;
        this.img = this.defaultImg;
        this.relRotP = true;
        this.mirrorX = false;
        this.mirrorY = false;
    };
    Grix.prototype.grixc = function (transform, color, img, anim) {
        return { color: color, transform: transform, img: img, anim: anim };
    };
    Grix.prototype.do_render = function () {
        this.start();
        if (this.texture != null) {
            console.log("hallo");
            this.texture.bind();
        }
        var size = this.childs.size();
        for (var i = 0; i < size; i++) {
            var child = this.childs.dequeue();
            this.getShader().getMatHandler().setModelMatrix(child.transform);
            if (this.texture != null && this.loadedTex == true && typeof this.texture.getCoord == "undefined") {
                var coords = this.texture.getImg(child.anim != null ? child.anim : child.img).getCoord();
                var mat = Matrix4.translate(coords.getXMin(), coords.getYMin());
                mat = Matrix4.scale(mat, coords.getXMax() - coords.getXMin(), coords.getYMax() - coords.getYMin());
                this.getShader().getMatHandler().setUVMatrix(mat);
            }
            if (this.texture == null)
                this.getShader().setVec4(Shader.COLOR, child.color);
            if ((this.texture != null && this.loadedTex == true) || this.texture == null)
                this.drawer.drawElements(0, gl.TRIANGLES);
        }
        this.end();
        this.clean();
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
    function Framebuffer(width, height) {
        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        this.frameBuffer.width = width;
        this.frameBuffer.height = height;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    Framebuffer.prototype.startRenderTo = function () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.frameBuffer.width, this.frameBuffer.height);
    };
    Framebuffer.prototype.stopRenderTo = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    };
    Framebuffer.prototype.bindTexture = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
    };
    return Framebuffer;
})();
//# sourceMappingURL=graphics.js.map