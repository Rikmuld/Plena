//make no safe default and save in sepearte thing if wanted option
var TextureManager = (function () {
    function TextureManager() {
        this.textures = new TreeMap(STRING_COMPARE);
        this.sprites = new TreeMap(STRING_COMPARE);
    }
    ;
    ;
    TextureManager.prototype.getSprite = function (key) {
        return this.sprites.apply(key);
    };
    TextureManager.prototype.getTexture = function (key) {
        return this.textures.apply(key);
    };
    TextureManager.prototype.loadSprite = function (src, key, safe, repeat, smooth) {
        if (!this.hasImg(key)) {
            return new Sprite(this.initTexture(key, src, repeat ? true : false, smooth ? true : false), safe);
        }
        else
            console.log("Sprite key already exsists!");
    };
    TextureManager.prototype.loadImg = function (src, key, repeat, smooth) {
        if (!this.hasImg(key)) {
            var img = this.initTexture(key, src, repeat ? true : false, smooth ? true : false);
            this.textures.put(key, img);
            return img;
        }
        else
            console.log("Img key already exsists!");
    };
    TextureManager.prototype.hasSprite = function (key) {
        return this.sprites.contains(key);
    };
    TextureManager.prototype.hasImg = function (key) {
        return this.textures.contains(key);
    };
    TextureManager.prototype.loadWebFont = function (id, text, font, smooth, background) {
        var _this = this;
        if (smooth === void 0) { smooth = false; }
        if (this.hasImg(id))
            console.log("Img key already exsists!");
        else {
            var texture = gl.createTexture();
            var retImg = new Img(texture, id);
            var c = document.createElement('canvas');
            var ctx = c.getContext('2d');
            ctx.font = font.fontsize + "px " + font.family;
            var width = ctx.measureText(text).width;
            var height = font.fontsize * 2;
            c.width = Math.pow(2, Math.ceil(MMath.logN(2, width)));
            c.height = Math.pow(2, Math.ceil(MMath.logN(2, height)));
            var align = font.align == "center" ? (c.width / 2) : font.align == "left" ? 0 : c.width;
            ctx.textAlign = font.align;
            ctx.textBaseline = font.baseline;
            ctx.font = font.fontsize + "px " + font.family;
            if (font.fill) {
                ctx.fillStyle = font.fill;
                ctx.fillText(text, align, c.height / 2);
            }
            if (font.stroke) {
                ctx.strokeStyle = font.stroke;
                ctx.strokeText(text, align, c.height / 2);
            }
            if (background)
                ctx.fill(background);
            var nwSrc = c.toDataURL();
            var tex = new Image();
            retImg.imgLoaded(c.width, c.height, 0, 0, width, height, false);
            tex.onload = function () {
                _this.handleTextureLoaded(tex, texture, false, smooth);
            };
            tex.src = nwSrc;
            this.textures.put(id, retImg);
            return retImg;
        }
    };
    TextureManager.prototype.initTexture = function (id, src, repeat, smooth) {
        var _this = this;
        var texture = gl.createTexture();
        var retImg = new Img(texture, id);
        var img = new Image();
        img.onload = function () {
            if (MMath.isPowerOf2(img.height) && MMath.isPowerOf2(img.width)) {
                retImg.imgLoaded(img.width, img.height, 0, 0, img.width, img.height, false);
                _this.handleTextureLoaded(img, texture, repeat, smooth);
            }
            else {
                var c = document.createElement('canvas');
                c.width = Math.pow(2, Math.ceil(MMath.logN(2, img.width)));
                c.height = Math.pow(2, Math.ceil(MMath.logN(2, img.height)));
                var ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var nwSrc = c.toDataURL();
                var tex = new Image();
                retImg.imgLoaded(c.width, c.height, 0, 0, img.width, img.height, false);
                tex.onload = function () {
                    _this.handleTextureLoaded(tex, texture, repeat, smooth);
                };
                tex.src = nwSrc;
            }
        };
        img.src = src;
        return retImg;
    };
    TextureManager.prototype.handleTextureLoaded = function (image, texture, repeat, smooth) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, smooth ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, smooth ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST_MIPMAP_NEAREST);
        if (repeat)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    return TextureManager;
})();
var TexCoord = (function () {
    function TexCoord(xMin, yMin, width, height, maxX, maxY, safe) {
        this.minX = (xMin + (safe ? 0.5 : 0)) / maxX;
        this.minY = (yMin + (safe ? 0.5 : 0)) / maxY;
        this.maxX = xMin / maxX + ((width - (safe ? 0.5 : 0)) / maxX);
        this.maxY = yMin / maxY + ((height - (safe ? 0.5 : 0)) / maxY);
        this.width = width;
        this.height = height;
    }
    TexCoord.prototype.getWidthFromHeight = function (height) {
        return ((this.maxX - this.minX) / (this.maxY - this.minY)) * height;
    };
    TexCoord.prototype.getHeightFromWidth = function (width) {
        return ((this.maxY - this.minY) / (this.maxX - this.minX)) * width;
    };
    TexCoord.prototype.getXMax = function () {
        return this.maxX;
    };
    TexCoord.prototype.getXMin = function () {
        return this.minX;
    };
    TexCoord.prototype.getYMax = function () {
        return this.maxY;
    };
    TexCoord.prototype.getYMin = function () {
        return this.minY;
    };
    return TexCoord;
})();
var Img = (function () {
    function Img(texture, id) {
        this.callbackLoaded = new Queue();
        this.isLoaded = false;
        this.texture = texture;
        this.id = id;
    }
    Img.prototype.getId = function () {
        return this.id;
    };
    Img.prototype.imgLoaded = function (maxX, maxY, x, y, width, height, safe) {
        this.sizeX = maxX;
        this.sizeY = maxY;
        this.width = width;
        this.height = height;
        this.coord = new TexCoord(x, y, width, height, maxX, maxY, safe);
        this.isLoaded = true;
        var size = this.callbackLoaded.size();
        for (var i = 0; i < size; i++) {
            this.callbackLoaded.dequeue()(this);
        }
        this.callbackLoaded = null;
    };
    Img.prototype.onLoaded = function (call) {
        if (this.isLoaded == false)
            this.callbackLoaded.enqueue(call);
        else
            call(this);
    };
    Img.prototype.getCoord = function () {
        return this.coord;
    };
    Img.prototype.bind = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    };
    Img.prototype.maxX = function () {
        return this.sizeX;
    };
    Img.prototype.maxY = function () {
        return this.sizeY;
    };
    Img.prototype.getWidth = function () {
        return this.width;
    };
    Img.prototype.getHeight = function () {
        return this.height;
    };
    Img.prototype.getGLTexture = function () {
        return this.texture;
    };
    return Img;
})();
var Sprite = (function () {
    function Sprite(img, safe) {
        this.img = img;
        this.subImages = new TreeMap(STRING_COMPARE);
        this.id = img.getId();
        if (safe)
            this.safe = true;
    }
    Sprite.prototype.onLoaded = function (call) {
        this.img.onLoaded(call);
    };
    Sprite.prototype.getId = function () {
        return this.id;
    };
    Sprite.prototype.getImgs = function () {
        return this.subImages.values();
    };
    Sprite.prototype.getImgNames = function () {
        return this.subImages.keys();
    };
    Sprite.prototype.addImg = function (key, x, y, width, height) {
        this.img.onLoaded(this.do_addImg(this, key, x, y, width, height));
        return this;
    };
    Sprite.prototype.addImgs = function (key, x, y, width, height, count, vertical) {
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical));
        return this;
    };
    Sprite.prototype.addAnimImgs = function (key, x, y, width, height, count, vertical) {
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical));
        return this;
    };
    Sprite.prototype.getAnims = function () {
        return this.animations.values();
    };
    Sprite.prototype.getAnim = function (key) {
        return this.animations.apply(key);
    };
    Sprite.prototype.getAnimNames = function () {
        return this.animations.keys();
    };
    Sprite.prototype.arbAnimName = function () {
        return this.animations.min();
    };
    Sprite.prototype.arbAnim = function () {
        return this.animations.apply(this.arbAnimName());
    };
    Sprite.prototype.do_addImgs = function (ths, ids, x, y, width, height, count, vertical) {
        return function (img) {
            var imgAr;
            var isAnim = false;
            var key;
            if (typeof ids == "string") {
                imgAr = [];
                isAnim = true;
            }
            for (var i = 0; i < count; i++) {
                vertical = vertical == true ? true : false;
                key = (typeof ids == "string") ? ids + "_" + i : ids[i];
                var rowCount;
                if (vertical)
                    rowCount = Math.floor((img.getHeight() - y) / height);
                else
                    rowCount = Math.floor((img.getWidth() - x) / width);
                var colom = vertical ? i % rowCount : Math.floor(i / rowCount);
                var row = vertical ? Math.floor(i / rowCount) : i % rowCount;
                var subImg = new Img(img.getGLTexture(), key);
                console.log(ths.safe);
                subImg.imgLoaded(img.maxX(), img.maxY(), x + row * width, y + colom * height, width, height, ths.safe);
                if (!isAnim)
                    ths.subImages.put(key, subImg);
                else
                    imgAr.push(subImg);
            }
            if (isAnim) {
                if (ths.animations == null)
                    ths.animations = new TreeMap(STRING_COMPARE);
                ths.animations.put(ids, imgAr);
            }
        };
    };
    Sprite.prototype.do_addImg = function (ths, key, x, y, width, height) {
        return function (img) {
            console.log(ths.safe);
            var subImg = new Img(img.getGLTexture(), key);
            subImg.imgLoaded(img.maxY(), img.maxX(), x, y, width, height, ths.safe);
            ths.subImages.put(key, subImg);
        };
    };
    Sprite.prototype.bind = function () {
        this.img.bind();
    };
    Sprite.prototype.getBaseImg = function () {
        return this.img;
    };
    Sprite.prototype.getImg = function (key) {
        return this.subImages.apply(key);
    };
    Sprite.prototype.arbImgName = function () {
        return this.subImages.min();
    };
    Sprite.prototype.arbImg = function () {
        return this.subImages.apply(this.arbImgName());
    };
    Sprite.prototype.hasImg = function (key) {
        return this.subImages.contains(key);
    };
    return Sprite;
})();
var WritableTexture = (function () {
    function WritableTexture(width, height, smooth, repeat) {
        var sizeX = Math.pow(2, Math.ceil(MMath.logN(2, width)));
        var sizeY = Math.pow(2, Math.ceil(MMath.logN(2, height)));
        this.frame = new Framebuffer(sizeX, sizeY, smooth, repeat);
        this.img = new Img(this.frame.getTexture(), "");
        this.img.imgLoaded(sizeX, sizeY, 0, 0, width, height, false);
    }
    WritableTexture.prototype.startWrite = function () {
        Plena.saveProjection();
        Plena.changeProjection(0, this.img.getWidth(), 0, this.img.getHeight());
        this.frame.startRenderTo();
    };
    WritableTexture.prototype.stopWrite = function () {
        Plena.forceRender();
        this.frame.stopRenderTo();
        Plena.restoreProjection();
    };
    WritableTexture.prototype.getTexture = function () {
        return this.frame.getTexture();
    };
    WritableTexture.prototype.getImg = function () {
        return this.img;
    };
    WritableTexture.prototype.bind = function () {
        this.img.bind();
    };
    return WritableTexture;
})();
var Font = (function () {
    function Font(size, family) {
        this.baseline = "middle";
        this.align = "left";
        this.fontsize = size;
        this.family = family;
    }
    Font.prototype.fillText = function (color) {
        this.fill = color;
        return this;
    };
    Font.prototype.strokeText = function (color) {
        this.stroke = color;
        return this;
    };
    Font.prototype.setBaseLine = function (pos) {
        this.baseline = pos;
        return this;
    };
    Font.prototype.setAlign = function (align) {
        this.align = align;
        return this;
    };
    Font.ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
    Font.ARIAL_NARROW = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
    Font.ARIAL_BOLD = "'Arial Narrow', Arial, sans-serif";
    Font.ARIAL_ROUNDED = "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif";
    Font.CALIBRI = "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif";
    Font.CANDARA = "Candara, Calibri, Segoe, 'Segoe UI', Optima, Arial, sans-serif";
    Font.CENTURY_GOTHIC = "'Century Gothic', CenturyGothic, AppleGothic, sans-serif";
    Font.GILL_SANS = "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif";
    Font.HELVETICA = "'Helvetica Neue', Helvetica, Arial, sans-serif";
    Font.TAHOMA = "Tahoma, Verdana, Segoe, sans-serif";
    Font.TREBUCHET_MS = "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif";
    Font.VERDANA = "Verdana, Geneva, sans-serif";
    Font.BOOK_ANTIQUA = "'Book Antiqua', Palatino, 'Palatino Linotype', 'Palatino LT STD', Georgia, serif";
    Font.CAMBRIA = "Cambria, Georgia, serif";
    Font.GARAMOND = "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif";
    Font.GEORGRIA = "Georgia, Times, 'Times New Roman', serif";
    Font.LUCIDA_BRIGHT = "'Lucida Bright', Georgia, serif";
    Font.PALATINO = "Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif";
    Font.BASKERVILLE = "Baskerville, 'Baskerville Old Face', 'Hoefler Text', Garamond, 'Times New Roman', serif";
    Font.TIMES_NEW_ROMAN = "TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif";
    Font.CONSOLAS = "Consolas, monaco, monospace";
    Font.COURIER_NEW = "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace";
    Font.MONACO = "monaco, Consolas, 'Lucida Console', monospace";
    Font.COPPERPLATE = "Copperplate, 'Copperplate Gothic Light', fantasy";
    Font.PAPYRUS = "Papyrus, fantasy";
    Font.BRUSH_SCRIPT_MT = "'Brush Script MT', cursive";
    return Font;
})();
var AudioManager = (function () {
    function AudioManager() {
        this.audio = new TreeMap(STRING_COMPARE);
    }
    AudioManager.prototype.getAudio = function (key) {
        return this.audio.apply(key);
    };
    AudioManager.prototype.hasAudio = function (key) {
        return this.audio.contains(key);
    };
    AudioManager.prototype.loadAudio = function (key, audioName) {
        var container = document.createElement("audio");
        var source = document.createElement("source");
        container.setAttribute('id', key);
        source.setAttribute('type', "audio/ogg");
        source.setAttribute('src', audioName);
        container.appendChild(source);
        document.body.appendChild(container);
        this.audio.put(key, new AudioObj(container));
    };
    return AudioManager;
})();
var AudioObj = (function () {
    function AudioObj(audio) {
        this.audio = audio;
    }
    AudioObj.prototype.play = function () {
        this.audio.play();
    };
    AudioObj.prototype.pause = function () {
        this.audio.pause();
    };
    AudioObj.prototype.isRunning = function () {
        !this.audio.paused;
    };
    AudioObj.prototype.currentTime = function () {
        return this.audio.currentTime;
    };
    AudioObj.prototype.setTime = function (num) {
        this.audio.currentTime = num;
    };
    AudioObj.prototype.duration = function () {
        return this.audio.duration;
    };
    AudioObj.prototype.setRunSpeed = function (speed) {
        this.audio.playbackRate = speed;
    };
    AudioObj.prototype.audioElement = function () {
        return this.audio;
    };
    return AudioObj;
})();
//# sourceMappingURL=assets.js.map