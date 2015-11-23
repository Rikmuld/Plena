class TextureManager {
    private textures = new TreeMap<string, Img>(STRING_COMPARE);;
    private sprites = new TreeMap<string, Sprite>(STRING_COMPARE);;

    getSprite(key: string): Sprite {
        return this.sprites.apply(key);
    }

    getTexture(key: string): Img {
        return this.textures.apply(key);
    }

    loadSprite(src: string, key: string, repeat?: boolean, smooth?: boolean):Sprite {
        if (!this.hasImg(key)) {
            return new Sprite(this.initTexture(key, src, repeat ? true : false, smooth ? true : false));
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

    private initTexture(id:string, src: string, repeat: boolean, smooth: boolean): Img {
        var texture = gl.createTexture();
        var retImg = new Img(texture, id);

        var img = new Image();
        img.onload = () => {
            var c = document.createElement('canvas');
            var size = Math.pow(2, Math.ceil(MMath.logN(2, img.height > img.width ? img.height:img.width)))
            c.width = size;
            c.height = size;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var nwSrc = c.toDataURL();
            var tex = new Image();
            retImg.imgLoaded(size, 0, 0, img.width, img.height);
            tex.onload = () => {
                this.handleTextureLoaded(tex, texture, repeat, smooth);
            }
            tex.src = nwSrc;
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

    constructor(xMin: number, yMin: number, width: number, height: number, max: number, safe: boolean) {
        this.minX = (xMin + (safe ? 0.5 : 0)) / max;
        this.minY = (yMin + (safe ? 0.5 : 0)) / max;
        this.maxX = xMin / max + ((width - (safe ? 0.5 : 0)) / max);
        this.maxY = yMin / max + ((height - (safe ? 0.5 : 0)) / max);

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
    private size: number;
    private width: number;
    private height: number;
    private coord: TexCoord;
    private callbackLoaded = new Queue<(Img) => void>();
    private isLoaded = false;
    private id: string;

    constructor(texture, id: string) {
        console.log(id + "H")
        this.texture = texture;
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    imgLoaded(max: number, x:number, y:number, width: number, height: number) {
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

    max(): number {
        return this.size;
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
    private subImages: TreeMap<string, Img>;

    constructor(img: Img) {
        this.img = img;
        this.subImages = new TreeMap<string, Img>(STRING_COMPARE);
        this.id = img.getId();
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

    addImgs(key:string|string[], x:number, y:number, width: number, height: number, count: number, vertical?:boolean):Sprite{
        this.img.onLoaded(this.do_addImgs(this, key, x, y, width, height, count, vertical))
        return this;
    }

    private do_addImgs(ths: Sprite, ids: string|string[], x: number, y: number, width: number, height: number, count: number, vertical?:boolean): (Img) => void {
        return function (img: Img) {
            for (var i = 0; i < count; i++) {
                vertical = vertical == true ? true : false;
                var key: string = (typeof ids == "string") ? (<string>ids) + "_" + i : (<string[]>ids)[i];

                var rowCount: number;
                if (vertical) rowCount = Math.floor((img.getHeight() - y) / height);
                else rowCount = Math.floor((img.getWidth() - x) / width);
                var colom = vertical ? i % rowCount : Math.floor(i / rowCount);
                var row = vertical ? Math.floor(i / rowCount) : i % rowCount;
                var subImg = new Img(img.getGLTexture(), key);

                console.log(row, colom)

                subImg.imgLoaded(img.max(), x + row * width, y + colom * height, width, height);
                ths.subImages.put(key, subImg);
            }
        }
    }

    private do_addImg(ths: Sprite, key: string, x:number, y:number, width: number, height: number): (Img) => void {
        return function (img: Img) {
            var subImg = new Img(img.getGLTexture(), key);
            subImg.imgLoaded(img.max(), x, y, width, height)
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

    getArbImg(): Img {
        return this.subImages.apply(this.subImages.min());
    }

    hasImg(key: string): boolean {
        return this.subImages.contains(key);
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