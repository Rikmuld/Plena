﻿//make no safe default and save in sepearte thing if wanted option
class TextureManager {
    private textures = new TreeMap<string, Img>(STRING_COMPARE);;
    private sprites = new TreeMap<string, Sprite>(STRING_COMPARE);;

    getSprite(key: string): Sprite {
        return this.sprites.apply(key);
    }

    getTexture(key: string): Img {
        return this.textures.apply(key);
    }

    loadSprite(src: string, key: string, safe:boolean, repeat?: boolean, smooth?: boolean):Sprite {
        if (!this.hasImg(key)) {
            return new Sprite(this.initTexture(key, src, repeat ? true : false, smooth ? true : false), safe);
        }
        else console.log("Sprite key already exsists!")
    }

    loadImg(src: string, key: string, repeat?: boolean, smooth?: boolean):Img {
        if (!this.hasImg(key)) {
            var img = this.initTexture(key, src, repeat ? true : false, smooth ? true : false);
            this.textures.put(key, img);
            return img;
        }
        else console.log("Img key already exsists!")
    }

    hasSprite(key: string): boolean {
        return this.sprites.contains(key)
    }

    hasImg(key: string):boolean {
        return this.textures.contains(key)
    }

    loadWebFont(id:string, text: string, font: Font, smooth:boolean = false, background?: string):Img {
        if (this.hasImg(id)) console.log("Img key already exsists!")
        else {
            var texture = gl.createTexture();
            var retImg = new Img(texture, id);

            var c = document.createElement('canvas');
            var ctx = c.getContext('2d');

            ctx.font = font.fontsize + "px " + font.family;

            var width = ctx.measureText(text).width;
            var height = font.fontsize * 2;

            c.width = Math.pow(2, Math.ceil(MMath.logN(2, width)))
            c.height = Math.pow(2, Math.ceil(MMath.logN(2, height)))

            var align = font.align == "center" ? (c.width / 2) : font.align == "left" ? 0 : c.width

            ctx.textAlign = font.align;
            ctx.textBaseline = font.baseline;
            ctx.font = font.fontsize + "px " + font.family;

            if (font.fill) {
                ctx.fillStyle = font.fill;
                ctx.fillText(text, align, c.height / 2)
            }

            if (font.stroke) {
                ctx.strokeStyle = font.stroke;
                ctx.strokeText(text, align, c.height / 2)
            }

            if (background) ctx.fill(background)

            var nwSrc = c.toDataURL();
            var tex = new Image();
            retImg.imgLoaded(c.width, c.height, 0, 0, width, height, false);
            tex.onload = () => {
                this.handleTextureLoaded(tex, texture, false, smooth);
            }
            tex.src = nwSrc;

            this.textures.put(id, retImg);
            return retImg;
        }
    }

    private initTexture(id:string, src: string, repeat: boolean, smooth: boolean): Img {
        var texture = gl.createTexture();
        var retImg = new Img(texture, id);

        var img = new Image();
        img.onload = () => {
            if (MMath.isPowerOf2(img.height) && MMath.isPowerOf2(img.width)) {
                retImg.imgLoaded(img.width, img.height, 0, 0, img.width, img.height, false);
                this.handleTextureLoaded(img, texture, repeat, smooth);
            } else {
                var c = document.createElement('canvas');
                c.width = Math.pow(2, Math.ceil(MMath.logN(2, img.width)));
                c.height = Math.pow(2, Math.ceil(MMath.logN(2, img.height)));
                var ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var nwSrc = c.toDataURL();
                var tex = new Image();
                retImg.imgLoaded(c.width, c.height, 0, 0, img.width, img.height, false);
                tex.onload = () => {
                    this.handleTextureLoaded(tex, texture, repeat, smooth);
                }
                tex.src = nwSrc;
            }
        };
        img.src = src;

        return retImg;
    }

    private handleTextureLoaded(image: HTMLImageElement, texture, repeat: boolean, smooth: boolean) {
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
    private maxX: number;
    private maxY: number;
    private minX: number;
    private minY: number;

    private width: number;
    private height: number;

    constructor(xMin: number, yMin: number, width: number, height: number, maxX: number, maxY:number, safe: boolean) {
        this.minX = (xMin + (safe ? 0.5 : 0)) / maxX;
        this.minY = (yMin + (safe ? 0.5 : 0)) / maxY;
        this.maxX = xMin / maxX + ((width - (safe ? 0.5 : 0)) / maxX);
        this.maxY = yMin / maxY + ((height - (safe ? 0.5 : 0)) / maxY);

        this.width = width;
        this.height = height;
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

class Img {
    private texture;
    private width: number;
    private height: number;
    private coord: TexCoord;
    private callbackLoaded = new Queue<(Img) => void>();
    private isLoaded = false;
    private id: string;
    private sizeX: number;
    private sizeY: number;

    constructor(texture, id: string) {
        this.texture = texture;
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    imgLoaded(maxX: number, maxY, x:number, y:number, width: number, height: number, safe:boolean) {
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
    }

    onLoaded(call: (Img) => void) {
        if (this.isLoaded == false) this.callbackLoaded.enqueue(call);
        else call(this);
    }

    getCoord(): TexCoord {
        return this.coord;
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

    maxX(): number {
        return this.sizeX;
    }

    maxY(): number {
        return this.sizeY;
    }

    getWidth():number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getGLTexture() {
        return this.texture;
    }
}

class Sprite {
    private img: Img;
    private id: string;
    private safe: boolean;
    private subImages: TreeMap<string, Img>;
    private animations: TreeMap<string, Img[]>;

    constructor(img: Img, safe?:boolean) {
        this.img = img;
        this.subImages = new TreeMap<string, Img>(STRING_COMPARE);
        this.id = img.getId();
        if (safe) this.safe = true;
    }

    onLoaded(call: (Img) => void) {
        this.img.onLoaded(call);
    }

    getId(): string {
        return this.id;
    }

    getImgs(): Img[] {
        return this.subImages.values();
    }

    getImgNames(): string[] {
        return this.subImages.keys();
    }

    addImg(key:string, x:number, y:number, width:number, height:number):Sprite {
        this.img.onLoaded(this.do_addImg(this, key, x, y, width, height))
        return this;
    }

    addImgs(key:string[], x:number, y:number, width: number, height: number, count: number, vertical?:boolean):Sprite{
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical))
        return this;
    }

    addAnimImgs(key: string, x: number, y: number, width: number, height: number, count: number, vertical?: boolean): Sprite {
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical))
        return this;
    }

    getAnims(): Img[][] {
        return this.animations.values();
    }

    getAnim(key:string): Img[] {
        return this.animations.apply(key);
    }

    getAnimNames(): string[] {
        return this.animations.keys();
    }

    arbAnimName(): string {
        return this.animations.min();
    }

    arbAnim(): Img[] {
        return this.animations.apply(this.arbAnimName());
    }

    private do_addImgs(ths: Sprite, ids: string|string[], x: number, y: number, width: number, height: number, count: number, vertical?:boolean): (Img) => void {
        return function (img: Img) {
            var imgAr: Img[];
            var isAnim = false;
            var key: string;

            if (typeof ids == "string") {
                imgAr = [];
                isAnim = true;
            }
            for (var i = 0; i < count; i++) {
                vertical = vertical == true ? true : false;
                key = (typeof ids == "string") ? (<string>ids) + "_" + i : (<string[]>ids)[i];

                var rowCount: number;
                if (vertical) rowCount = Math.floor((img.getHeight() - y) / height);
                else rowCount = Math.floor((img.getWidth() - x) / width);
                var colom = vertical ? i % rowCount : Math.floor(i / rowCount);
                var row = vertical ? Math.floor(i / rowCount) : i % rowCount;
                var subImg = new Img(img.getGLTexture(), key);

                console.log(ths.safe)
                subImg.imgLoaded(img.maxX(), img.maxY(), x + row * width, y + colom * height, width, height, ths.safe);
                if (!isAnim) ths.subImages.put(key, subImg);
                else imgAr.push(subImg)
            }

            if (isAnim) {
                if (ths.animations == null) ths.animations = new TreeMap<string, Img[]>(STRING_COMPARE);
                ths.animations.put(<string>ids, imgAr);
            }
        }
    }

    private do_addImg(ths: Sprite, key: string, x:number, y:number, width: number, height: number): (Img) => void {
        return function (img: Img) {
            console.log(ths.safe)
            var subImg = new Img(img.getGLTexture(), key);
            subImg.imgLoaded(img.maxY(), img.maxX(), x, y, width, height, ths.safe)
            ths.subImages.put(key, subImg);
        }
    }

    bind() {
        this.img.bind()
    }

    getBaseImg(): Img {
        return this.img;
    }

    getImg(key: string): Img {
        return this.subImages.apply(key);
    }

    arbImgName(): string {
        return this.subImages.min();
    }

    arbImg(): Img {
        return this.subImages.apply(this.arbImgName());
    }

    hasImg(key: string): boolean {
        return this.subImages.contains(key);
    }
}

class WritableTexture {
    img: Img;
    frame: Framebuffer;

    constructor(width: number, height: number, smooth?:boolean, repeat?:boolean) {
        var sizeX = Math.pow(2, Math.ceil(MMath.logN(2, width)));
        var sizeY = Math.pow(2, Math.ceil(MMath.logN(2, height)));
        this.frame = new Framebuffer(sizeX, sizeY, smooth, repeat);
        this.img = new Img(this.frame.getTexture(), "");
        this.img.imgLoaded(sizeX, sizeY, 0, 0, width, height, false);
    }

    startWrite() {
        Plena.saveProjection();
        Plena.changeProjection(0, this.img.getWidth(), 0, this.img.getHeight());
        this.frame.startRenderTo();
    }

    stopWrite() {
        Plena.forceRender();
        this.frame.stopRenderTo();
        Plena.restoreProjection();
    }

    getTexture(): WebGLTexture {
        return this.frame.getTexture();
    }

    getImg():Img {
        return this.img;
    }

    bind() {
        this.img.bind();
    }
}

class Font {
    fontsize: number;
    family: string;
    baseline: string = "middle";
    align: string = "left";
    fill: string;
    stroke: string;

    static ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif"
    static ARIAL_NARROW = "'Arial Black', 'Arial Bold', Gadget, sans-serif"
    static ARIAL_BOLD = "'Arial Narrow', Arial, sans-serif"
    static ARIAL_ROUNDED = "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif"
    static CALIBRI = "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif"
    static CANDARA = "Candara, Calibri, Segoe, 'Segoe UI', Optima, Arial, sans-serif"
    static CENTURY_GOTHIC = "'Century Gothic', CenturyGothic, AppleGothic, sans-serif"
    static GILL_SANS = "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif"
    static HELVETICA = "'Helvetica Neue', Helvetica, Arial, sans-serif"
    static TAHOMA = "Tahoma, Verdana, Segoe, sans-serif"
    static TREBUCHET_MS = "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif"
    static VERDANA = "Verdana, Geneva, sans-serif"
    static BOOK_ANTIQUA = "'Book Antiqua', Palatino, 'Palatino Linotype', 'Palatino LT STD', Georgia, serif"
    static CAMBRIA = "Cambria, Georgia, serif"
    static GARAMOND = "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif"
    static GEORGRIA = "Georgia, Times, 'Times New Roman', serif"
    static LUCIDA_BRIGHT = "'Lucida Bright', Georgia, serif"
    static PALATINO = "Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif"
    static BASKERVILLE = "Baskerville, 'Baskerville Old Face', 'Hoefler Text', Garamond, 'Times New Roman', serif"
    static TIMES_NEW_ROMAN = "TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif"
    static CONSOLAS = "Consolas, monaco, monospace"
    static COURIER_NEW = "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace"
    static MONACO = "monaco, Consolas, 'Lucida Console', monospace"
    static COPPERPLATE = "Copperplate, 'Copperplate Gothic Light', fantasy"
    static PAPYRUS = "Papyrus, fantasy"
    static BRUSH_SCRIPT_MT = "'Brush Script MT', cursive"

    constructor(size: number, family: string) {
        this.fontsize = size;
        this.family = family;
    }

    fillText(color: string): Font {
        this.fill = color;
        return this;
    }

    strokeText(color: string): Font {
        this.stroke = color;
        return this;
    }

    setBaseLine(pos: string): Font {
        this.baseline = pos;
        return this;
    }

    setAlign(align: string): Font {
        this.align = align;
        return this;
    }
}

class AudioManager {
    private audio: TreeMap<string, AudioObj> = new TreeMap<string, AudioObj>(STRING_COMPARE);

    getAudio(key: string): AudioObj {
        return this.audio.apply(key);
    }

    hasAudio(key:string) {
        return this.audio.contains(key);
    }

    loadAudio(key: string, audioName: string) {
        var container = document.createElement("audio");
        var source = document.createElement("source");
        container.setAttribute('id', key);
        source.setAttribute('type', "audio/ogg");
        source.setAttribute('src', audioName);
        container.appendChild(source);
        document.body.appendChild(container);

        this.audio.put(key, new AudioObj(container));
    }
}

class AudioObj {
    private audio: HTMLAudioElement;

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

    currentTime():number {
        return this.audio.currentTime;
    }

    setTime(num: number) {
        this.audio.currentTime = num;
    }

    duration():number {
        return this.audio.duration;
    }

    setRunSpeed(speed: number) {
        this.audio.playbackRate = speed;
    }

    audioElement(): HTMLAudioElement {
        return this.audio;
    }
}