//make no safe default and save in sepearte thing if wanted option
var TextureManager = (function () {
    function TextureManager() {
    }
    TextureManager.prototype.loadSprite = function (src, safe, repeat, smooth) {
        return new Sprite(this.initTexture(src, repeat ? true : false, smooth ? true : false), safe);
    };
    TextureManager.prototype.loadImg = function (src, repeat, smooth) {
        return this.initTexture(src, repeat ? true : false, smooth ? true : false);
    };
    TextureManager.prototype.loadWebFont = function (text, font, background, maxWidth, offset, smooth) {
        var _this = this;
        if (maxWidth === void 0) { maxWidth = -1; }
        if (offset === void 0) { offset = 0; }
        if (smooth === void 0) { smooth = false; }
        var texture = gl.createTexture();
        var retImg = new Img(texture);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        font.apply(ctx);
        var splitText;
        if (maxWidth >= 0) {
            var splitText = this.textSplit(text, maxWidth, ctx);
            maxWidth = Math.max(maxWidth, this.getMaxLength(ctx, splitText));
        }
        var width = maxWidth >= 0 ? maxWidth : ctx.measureText(text).width + 3;
        var height = splitText ? (splitText.length * (font.getFontSize() + offset)) - offset : font.getFontSize();
        height = height += font.getFontSize();
        var align = (font.getAlign() == "center") ? width / 2 : font.getAlign() == "right" ? width : 0;
        c.width = Math.pow(2, Math.ceil(MMath.logN(2, width)));
        c.height = Math.pow(2, Math.ceil(MMath.logN(2, height)));
        font.apply(ctx);
        if (background) {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
        }
        if (splitText) {
            if (font.getFill()) {
                ctx.fillStyle = font.getFill();
                for (var i = 0; i < splitText.length; i++) {
                    var tx = splitText[i];
                    ctx.fillText(tx, align, i * (font.getFontSize() + offset) + font.getFontSize() / 2);
                }
            }
            if (font.getStroke()) {
                ctx.strokeStyle = font.getStroke();
                for (var i = 0; i < splitText.length; i++) {
                    var tx = splitText[i];
                    ctx.strokeText(tx, align, i * (font.getFontSize() + offset) + font.getFontSize() / 2);
                }
            }
        }
        else {
            if (font.getFill()) {
                ctx.fillStyle = font.getFill();
                ctx.fillText(text, align, font.getFontSize() / 2);
            }
            if (font.getStroke()) {
                ctx.strokeStyle = font.getStroke();
                ctx.strokeText(text, align, font.getFontSize() / 2);
            }
        }
        var nwSrc = c.toDataURL();
        var tex = new Image();
        retImg.imgLoaded(c.width, c.height, 0, 0, width, height, false);
        tex.onload = function () {
            _this.handleTextureLoaded(tex, texture, false, smooth);
        };
        tex.src = nwSrc;
        return retImg;
    };
    TextureManager.prototype.getMaxLength = function (ctx, text) {
        var max = 0;
        for (var i = 0; i < text.length; i++) {
            var l = ctx.measureText(text[i]).width;
            if (l > max)
                max = l;
        }
        return max;
    };
    TextureManager.prototype.textSplit = function (text, max, ctx) {
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
    TextureManager.prototype.initTexture = function (src, repeat, smooth) {
        var _this = this;
        var texture = gl.createTexture();
        var retImg = new Img(texture);
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
    function Img(texture) {
        this.callbackLoaded = new Queue();
        this.isLoaded = false;
        this.texture = texture;
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
                var subImg = new Img(img.getGLTexture());
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
            var subImg = new Img(img.getGLTexture());
            subImg.imgLoaded(img.maxX(), img.maxY(), x, y, width, height, ths.safe);
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
var FontMap = (function () {
    function FontMap(font, fontString, smooth, safe, background) {
        if (fontString === void 0) { fontString = FontMap.fontString; }
        if (smooth === void 0) { smooth = false; }
        if (safe === void 0) { safe = false; }
        this.fontMap = new Sprite(Plena.textImg(fontString, font.align("left"), font.getFontSize() * 12, 8, smooth, background), safe);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        font.apply(ctx);
        this.font = font;
        this.dim = new TreeMap(STRING_COMPARE);
        this.spaceWidth = ctx.measureText(" ").width;
        var text = fontString.replace(/\s/g, "");
        var width = 0;
        var height = 0;
        for (var i = 0; i < text.length; i++) {
            var a = text.charAt(i);
            var textWidth = ctx.measureText(a).width;
            var textHeight = font.getFontSize() * 1.20 - 8;
            if (width + textWidth > font.getFontSize() * 12) {
                width = 0;
                height += font.getFontSize() * 1.127;
            }
            this.fontMap.addImg(a, width, height, textWidth, textHeight);
            this.dim.put(a, [textWidth, textHeight]);
            width += textWidth + this.spaceWidth * 2;
        }
    }
    FontMap.prototype.getFont = function () {
        return this.font;
    };
    FontMap.prototype.getMap = function () {
        return this.fontMap;
    };
    FontMap.prototype.getLetter = function (char) {
        return this.fontMap.getImg(char);
    };
    FontMap.prototype.spacing = function () {
        return this.spaceWidth;
    };
    FontMap.prototype.getDim = function (c) {
        return this.dim.apply(c);
    };
    FontMap.fontString = "!  @  €  \"  #  $  %  ^  &  *  (  )  [  ]  {  }  -  =  ,  .  ;  :  '  >  <  /  ?  \\  |  1  2  3  4  5  6  7  8  9  0  `  ~  a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z";
    return FontMap;
})();
var WritableTexture = (function () {
    function WritableTexture(width, height, smooth, repeat) {
        var sizeX = Math.pow(2, Math.ceil(MMath.logN(2, width)));
        var sizeY = Math.pow(2, Math.ceil(MMath.logN(2, height)));
        this.frame = new Framebuffer(sizeX, sizeY, smooth, repeat);
        this.img = new Img(this.frame.getTexture());
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
        this.textAlign = "left";
        this.fontsize = size;
        this.family = family;
    }
    Font.prototype.getFontSize = function () {
        return this.fontsize;
    };
    Font.prototype.getFamily = function () {
        return this.family;
    };
    Font.prototype.getAlign = function () {
        return this.textAlign;
    };
    Font.prototype.getFill = function () {
        return this.textFill;
    };
    Font.prototype.getStroke = function () {
        console.log(this.textStroke);
        return this.textStroke;
    };
    Font.prototype.apply = function (ctx) {
        ctx.textAlign = this.getAlign();
        ctx.textBaseline = "middle";
        ctx.font = this.getFontSize() + "px " + this.getFamily();
    };
    Font.prototype.size = function (size) {
        this.fontsize = size;
        return this;
    };
    Font.prototype.fill = function (r, g, b, a) {
        this.textFill = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        return this;
    };
    Font.prototype.stroke = function (r, g, b, a) {
        this.textStroke = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        return this;
    };
    Font.prototype.align = function (align) {
        this.textAlign = align;
        return this;
    };
    Font.ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
    Font.ARIAL_BOLD = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
    Font.ARIAL_NARROW = "'Arial Narrow', Arial, sans-serif";
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