var TextureManager = (function () {
    function TextureManager() {
        this.textureRawMap = {};
        this.textureMap = {};
    }
    TextureManager.prototype.getTextureRaw = function (key) {
        return this.textureRawMap[key];
    };
    TextureManager.prototype.getTexture = function (key) {
        return this.textureMap[key];
    };
    TextureManager.prototype.loadTextureRaw = function (src, key, max, repeat, smooth) {
        this.textureRawMap[key] = this.initTexture(src, max, repeat, smooth);
    };
    TextureManager.prototype.loadTexture = function (key, texName, xMin, yMin, width, height, safe) {
        this.textureMap[key] = new TextureBase(this.getTextureRaw(texName), new TexCoord(xMin, yMin, width, height, this.getTextureRaw(texName).max, safe));
    };
    TextureManager.prototype.initTexture = function (src, max, repeat, smooth) {
        var _this = this;
        var texture = gl.createTexture();
        var img = new Image();
        img.onload = function () {
            _this.handleTextureLoaded(img, texture, repeat, smooth);
        };
        img.src = src;
        return new Texture(texture, max);
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
        this.baseWidth = width;
        this.baseHeight = height;
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
var Texture = (function () {
    function Texture(texture, max) {
        this.texture = texture;
        this.max = max;
    }
    Texture.prototype.bind = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    };
    Texture.prototype.getImgMax = function () {
        return this.max;
    };
    return Texture;
})();
var TextureBase = (function () {
    function TextureBase(texture, coord) {
        this.base = texture;
        this.coord = coord;
    }
    TextureBase.prototype.bind = function () {
        this.base.bind();
    };
    TextureBase.prototype.getCoord = function () {
        return this.coord;
    };
    return TextureBase;
})();
var AudioManager = (function () {
    function AudioManager() {
        this.audioMap = {};
    }
    AudioManager.prototype.getAudio = function (key) {
        return this.audioMap[key];
    };
    AudioManager.prototype.loadAudio = function (key, audioName) {
        var container = document.createElement("audio");
        var source = document.createElement("source");
        container.setAttribute('id', key);
        source.setAttribute('type', "audio/ogg");
        source.setAttribute('src', audioName);
        container.appendChild(source);
        document.body.appendChild(container);
        this.audioMap[key] = new AudioObj(container);
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
    return AudioObj;
})();
//# sourceMappingURL=assets.js.map