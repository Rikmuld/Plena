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
    TextureManager.prototype.loadSprite = function (src, key, repeat, smooth) {
        if (!this.hasImg(key)) {
            return new Sprite(this.initTexture(key, src, repeat ? true : false, smooth ? true : false));
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
    TextureManager.prototype.initTexture = function (id, src, repeat, smooth) {
        var _this = this;
        var texture = gl.createTexture();
        var retImg = new Img(texture, id);
        var img = new Image();
        img.onload = function () {
            var c = document.createElement('canvas');
            var size = Math.pow(2, Math.ceil(MMath.logN(2, img.height > img.width ? img.height : img.width)));
            c.width = size;
            c.height = size;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var nwSrc = c.toDataURL();
            var tex = new Image();
            retImg.imgLoaded(size, 0, 0, img.width, img.height);
            tex.onload = function () {
                _this.handleTextureLoaded(tex, texture, repeat, smooth);
            };
            tex.src = nwSrc;
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
    function TexCoord(xMin, yMin, width, height, max, safe) {
        this.minX = (xMin + (safe ? 0.5 : 0)) / max;
        this.minY = (yMin + (safe ? 0.5 : 0)) / max;
        this.maxX = xMin / max + ((width - (safe ? 0.5 : 0)) / max);
        this.maxY = yMin / max + ((height - (safe ? 0.5 : 0)) / max);
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
        console.log(id + "H");
        this.texture = texture;
        this.id = id;
    }
    Img.prototype.getId = function () {
        return this.id;
    };
    Img.prototype.imgLoaded = function (max, x, y, width, height) {
        this.size = max;
        this.width = width;
        this.height = height;
        this.coord = new TexCoord(x, y, width, height, max, false);
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
    Img.prototype.max = function () {
        return this.size;
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
    function Sprite(img) {
        this.img = img;
        this.subImages = new TreeMap(STRING_COMPARE);
        this.id = img.getId();
    }
    Sprite.prototype.getId = function () {
        return this.id;
    };
    Sprite.prototype.addImg = function (key, x, y, width, height) {
        this.img.onLoaded(this.do_addImg(this, key, x, y, width, height));
        return this;
    };
    Sprite.prototype.addImgs = function (key, x, y, width, height, count, vertical) {
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical));
        return this;
    };
    Sprite.prototype.do_addImgs = function (ths, ids, x, y, width, height, count, vertical) {
        return function (img) {
            for (var i = 0; i < count; i++) {
                vertical = vertical == true ? true : false;
                var key = (typeof ids == "string") ? ids + "_" + i : ids[i];
                var rowCount;
                if (vertical)
                    rowCount = Math.floor((img.getHeight() - y) / height);
                else
                    rowCount = Math.floor((img.getWidth() - x) / width);
                var colom = vertical ? i % rowCount : Math.floor(i / rowCount);
                var row = vertical ? Math.floor(i / rowCount) : i % rowCount;
                var subImg = new Img(img.getGLTexture(), key);
                console.log(row, colom);
                subImg.imgLoaded(img.max(), x + row * width, y + colom * height, width, height);
                ths.subImages.put(key, subImg);
            }
        };
    };
    Sprite.prototype.do_addImg = function (ths, key, x, y, width, height) {
        return function (img) {
            var subImg = new Img(img.getGLTexture(), key);
            subImg.imgLoaded(img.max(), x, y, width, height);
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
    Sprite.prototype.getArbImg = function () {
        return this.subImages.apply(this.subImages.min());
    };
    Sprite.prototype.hasImg = function (key) {
        return this.subImages.contains(key);
    };
    return Sprite;
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