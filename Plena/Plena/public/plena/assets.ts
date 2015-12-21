//make no safe default and save in sepearte thing if wanted option
class TextureManager {
    loadSprite(src: string, safe:boolean, repeat?: boolean, smooth?: boolean):Sprite {
        return new Sprite(this.initTexture(src, repeat ? true : false, smooth ? true : false), safe);
    }

    loadImg(src: string, repeat?: boolean, smooth?: boolean):Img {
        return this.initTexture(src, repeat ? true : false, smooth ? true : false);
    }

    loadWebFont(text: string, font: Font, background?: string, maxWidth: number = -1, offset: number = 0, smooth:boolean = false):Img {
        var texture = gl.createTexture();
        var retImg = new Img(texture);

        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        font.apply(ctx);

        var splitText:string[];
        if (maxWidth >= 0) {
            var splitText = this.textSplit(text, maxWidth, ctx);
            maxWidth = Math.max(maxWidth, this.getMaxLength(ctx, splitText))
        }

        var width = maxWidth >= 0 ? maxWidth : ctx.measureText(text).width + 3;
        var height = splitText ? (splitText.length * (font.getFontSize() + offset)) - offset : font.getFontSize();
        height = height += font.getFontSize();
        var align = (font.getAlign() == "center") ? width / 2 : font.getAlign() == "right" ? width : 0;

        c.width = Math.pow(2, Math.ceil(MMath.logN(2, width)))
        c.height = Math.pow(2, Math.ceil(MMath.logN(2, height)))
        font.apply(ctx)

        if (background) {
            ctx.fillStyle = background
            ctx.fillRect(0, 0, width, height);
        }

        if (splitText) {
            if (font.getFill()) {
                ctx.fillStyle = font.getFill();
                for (var i = 0; i < splitText.length; i++) {
                    var tx = splitText[i];
                    ctx.fillText(tx, align, i * (font.getFontSize() + offset) + font.getFontSize() / 2)
                }
            }
            if (font.getStroke()) {
                ctx.strokeStyle = font.getStroke();
                for (var i = 0; i < splitText.length; i++) {
                    var tx = splitText[i];
                    ctx.strokeText(tx, align, i * (font.getFontSize() + offset) + font.getFontSize() / 2)
                }
            }
        } else {
            if (font.getFill()) {
                ctx.fillStyle = font.getFill();
                ctx.fillText(text, align, font.getFontSize() / 2)
            }

            if (font.getStroke()) {
                ctx.strokeStyle = font.getStroke();
                ctx.strokeText(text, align, font.getFontSize() / 2)
            }
        }

        var nwSrc = c.toDataURL();
        var tex = new Image();
        retImg.imgLoaded(c.width, c.height, 0, 0, width, height, false);
        tex.onload = () => {
            this.handleTextureLoaded(tex, texture, false, smooth);
        }
        tex.src = nwSrc;
        return retImg;
    }

    private getMaxLength(ctx:CanvasRenderingContext2D, text:string[]):number {
        var max = 0;
        for (var i = 0; i < text.length; i++) {
            var l = ctx.measureText(text[i]).width;
            if (l > max) max = l;
        }
        return max;
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

    private initTexture(src: string, repeat: boolean, smooth: boolean): Img {
        var texture = gl.createTexture();
        var retImg = new Img(texture);

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

    constructor(texture) {
        this.texture = texture;
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
                var subImg = new Img(img.getGLTexture());

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
            var subImg = new Img(img.getGLTexture());
            subImg.imgLoaded(img.maxX(), img.maxY(), x, y, width, height, ths.safe)
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

class FontMap {
    static fontString = "!  @  €  \"  #  $  %  ^  &  *  (  )  [  ]  {  }  -  =  ,  .  ;  :  '  >  <  /  ?  \\  |  1  2  3  4  5  6  7  8  9  0  `  ~  a  b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z";

    private fontMap: Sprite;
    private spaceWidth: number;
    private dim: TreeMap<string, [number,number]>;
    private font;

    constructor(font: Font, fontString: string = FontMap.fontString, smooth: boolean = false, safe: boolean = false, background?: string) {
        this.fontMap = new Sprite(Plena.textImg(fontString, font.align("left"), font.getFontSize() * 12, 8, smooth, background), safe);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        font.apply(ctx);
        this.font = font;
        this.dim = new TreeMap<string, [number, number]>(STRING_COMPARE);
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

    getFont(): Font {
        return this.font;
    }

    getMap(): Sprite {
        return this.fontMap;
    }

    getLetter(char: string):Img {
        return this.fontMap.getImg(char);
    }

    spacing(): number {
        return this.spaceWidth;
    }

    getDim(c: string): [number, number] {
        return this.dim.apply(c);
    }
}

class WritableTexture {
    img: Img;
    frame: Framebuffer;

    constructor(width: number, height: number, smooth?:boolean, repeat?:boolean) {
        var sizeX = Math.pow(2, Math.ceil(MMath.logN(2, width)));
        var sizeY = Math.pow(2, Math.ceil(MMath.logN(2, height)));
        this.frame = new Framebuffer(sizeX, sizeY, smooth, repeat);
        this.img = new Img(this.frame.getTexture());
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
    private fontsize: number;
    private family: string;
    private textAlign: string = "left";
    private textFill: string;
    private textStroke: string;

    getFontSize(): number {
        return this.fontsize;
    }

    getFamily(): string {
        return this.family;
    }

    getAlign(): string {
        return this.textAlign;
    }

    getFill(): string {
        return this.textFill;
    }

    getStroke(): string {
        console.log(this.textStroke)
        return this.textStroke;
    }

    static ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif"
    static ARIAL_BOLD = "'Arial Black', 'Arial Bold', Gadget, sans-serif"
    static ARIAL_NARROW = "'Arial Narrow', Arial, sans-serif"
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

    apply(ctx: CanvasRenderingContext2D) {
        ctx.textAlign = this.getAlign();
        ctx.textBaseline = "middle";
        ctx.font = this.getFontSize() + "px " + this.getFamily();
    }

    size(size: number): Font {
        this.fontsize = size;
        return this;
    }

    fill(r: number, g: number, b: number, a:number): Font {
        this.textFill = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        return this;
    }

    stroke(r: number, g: number, b: number, a: number): Font {
        this.textStroke = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        return this;
    }

    align(align: string): Font {
        this.textAlign = align;
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