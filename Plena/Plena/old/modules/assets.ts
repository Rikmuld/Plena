class TextureManager {
    textureRawMap = {};
    textureMap = {};

    getTextureRaw(key: string): Texture {
        return this.textureRawMap[key];
    }

    getTexture(key: string): TextureBase {
        return this.textureMap[key];
    }

    loadTextureRaw(src: string, key: string, max: number, repeat: boolean, smooth: boolean) {
        this.textureRawMap[key] = this.initTexture(src, max, repeat, smooth);
    }

    loadTexture(key: string, texName: string, xMin: number, yMin: number, width: number, height: number, safe: boolean) {
        this.textureMap[key] = new TextureBase(this.getTextureRaw(texName), new TexCoord(xMin, yMin, width, height, this.getTextureRaw(texName).max, safe));
    }

    initTexture(src: string, max: number, repeat: boolean, smooth: boolean): Texture {
        var texture = gl.createTexture();
        var img = new Image();
        img.onload = () => {
            this.handleTextureLoaded(img, texture, repeat, smooth);
        };
        img.src = src;
        return new Texture(texture, max);
    }

    handleTextureLoaded(image, texture, repeat: boolean, smooth: boolean) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, smooth ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, smooth ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST_MIPMAP_NEAREST);
        if (repeat) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

class TexCoord {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;

    baseWidth: number;
    baseHeight: number;

    constructor(xMin: number, yMin: number, width: number, height: number, max: number, safe: boolean) {
        this.minX = (xMin + (safe ? 0.5 : 0)) / max;
        this.minY = (yMin + (safe ? 0.5 : 0)) / max;
        this.maxX = xMin / max + ((width - (safe ? 0.5 : 0)) / max);
        this.maxY = yMin / max + ((height - (safe ? 0.5 : 0)) / max);

        this.baseWidth = width;
        this.baseHeight = height;
    }

    getWidthFromHeight(height: number): number {
        return ((this.maxX - this.minX) / (this.maxY - this.minY)) * height;
    }

    getHeightFromWidth(width: number): number {
        return ((this.maxY - this.minY) / (this.maxX - this.minX)) * width;
    }

    getXMax(): number {
        return this.maxX;
    }

    getXMin(): number {
        return this.minX;
    }

    getYMax(): number {
        return this.maxY;
    }

    getYMin(): number {
        return this.minY;
    }
}

class Texture {
    texture;
    max: number;

    constructor(texture, max: number) {
        this.texture = texture;
        this.max = max;
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

    getImgMax(): number {
        return this.max;
    }
}

class TextureBase {
    coord: TexCoord;
    base: Texture;

    constructor(texture: Texture, coord: TexCoord) {
        this.base = texture;
        this.coord = coord;
    }

    bind() {
        this.base.bind();
    }

    getCoord(): TexCoord {
        return this.coord;
    }
}

class AudioManager {
    audioMap = {};

    getAudio(key: string): AudioObj {
        return this.audioMap[key];
    }

    loadAudio(key: string, audioName: string) {
        var container = document.createElement("audio");
        var source = document.createElement("source");
        container.setAttribute('id', key);
        source.setAttribute('type', "audio/ogg");
        source.setAttribute('src', audioName);
        container.appendChild(source);
        document.body.appendChild(container);

        this.audioMap[key] = new AudioObj(container);
    }
}

class AudioObj {
    audio: HTMLAudioElement;

    constructor(audio: HTMLAudioElement) {
        this.audio = audio;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    isRunning() {
        !this.audio.paused
    }
}