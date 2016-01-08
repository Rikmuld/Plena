﻿//fix render function
abstract class Grix {
    protected mode = gl.TRIANGLES;
    protected drawer = new Render();
    protected customeShader: Shader;

    protected isFinal: boolean;
    private childs = new Queue<GrixC>();

    protected width: number;
    protected height: number;

    protected xT: number = 0;
    protected yT: number = 0;
    protected sXT: number = 1;
    protected sYT: number = 1;
    protected angle: number = 0;
    protected pmX: number = 0;
    protected pmY: number = 0;
    protected prX: number = 0;
    protected prY: number = 0;
    protected relRotP: boolean = true;
    protected mirrorX: boolean = false;
    protected mirrorY: boolean = false;

    constructor(customShader?: Shader) {
        this.drawer = new Render();

        if (customShader) {
            this.customeShader = customShader;
            if (!Plena.manager().hasShader(customShader.getId())) Plena.manager().addShader(customShader);
        }
    }

    protected start() {
        this.drawer.start();
    }
    protected end() {
        this.drawer.end();
    }
    doRenderAll() {
        this.start();
        var size = this.childs.size();
        for (var i = 0; i < size; i++) {
            var child = this.childs.dequeue();
            this.getShader().getMatHandler().setModelMatrix(child.transform);
            this.doRender(child)
        }
        this.end();
        this.clean();
    }
    protected doRender(child: GrixC) {
        this.drawer.drawElements(0, this.mode)
    }
    populate():Grix {
        this.drawer.populate(this.getShader());
        Plena.manager().addGrix(this.getShader(), this);
        this.isFinal = true;
        this.clean();
        return this;
    }
    abstract getShader(): Shader;
    isLoaded():boolean {
        return true;
    }
    render() {
        //rotating and mirroring does not work together, I made something to have the displacement of mirroring to be corected, but I did not keep the rotation into account, so only angle==0 will work with mirroring, it does work with scaling
        if (!this.isLoaded()) return;

        var centerX = ((this.width * this.sXT) / 2);
        var centerY = ((this.height * this.sYT) / 2);

        var aC = Math.cos(this.angle)
        var aS = Math.sin(this.angle)
        var xTr = centerX + this.xT;
        var yTr = centerY + this.yT;

        var mX = (this.mirrorX ? -1 : 1);
        var mY = (this.mirrorY ? -1 : 1);

        var x2 = !this.relRotP ? - this.prX + this.xT : - centerX - this.prX * (centerX * 2);
        var y2 = !this.relRotP ? -this.prY + this.yT : - centerY - this.prY * (centerY * 2);
        var x3 = this.sXT * mX;
        var y3 = this.sYT * mY;
        var x1 = xTr + (this.mirrorX ? centerX * 2 : 0) + (!this.relRotP ? this.prX - xTr : this.prX * (centerX * 2)) + aC * x2 + -aS * y2;
        var y1 = yTr + (this.mirrorY ? centerY * 2 : 0) + (!this.relRotP ? this.prY - yTr : this.prY * (centerY * 2)) + aS * x2 + aC * y2;

        var transform = [aC * x3, aS * x3, 0, 0, -aS * y3, aC * y3, 0, 0, 0, 0, 1, 0, x1, y1, 0, 1];

        this.childs.enqueue(this.createGrixc(transform));
    }
    protected createGrixc(transform: Mat4):GrixC {
        return { transform: transform };
    }
    move(x: number, y: number) {
        this.xT += x;
        this.yT += y;
    }
    moveTo(x: number, y: number) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
        this.yT = y - (this.height * this.sYT) * this.pmY;
    }
    moveXTo(x: number) {
        this.xT = x - (this.width * this.sXT) * this.pmX;
    }
    moveYTo(y: number) {
        this.yT = y - (this.height * this.sYT) * this.pmY;
    }
    scale(x: number, y: number) {
        this.sXT += x;
        this.sYT += y;
    }
    scaleTo(x: number, y: number) {
        this.sXT = x;
        this.sYT = y;
    }
    scaleToSize(width: number, height: number) {
        var x = width / this.width;
        var y = height / this.height;
        this.scaleTo(x, y);
    }
    scaleWidthToSize(width: number) {
        var x = width / this.width;
        this.scaleTo(x, x);
    }
    scaleHeightToSize(height: number) {
        var y = height / this.height;
        this.scaleTo(y, y);
    }
    rotate(angle: number) {
        this.angle += angle;
    }
    rotateTo(angle: number) {
        this.angle = angle;
    }
    rotateDeg(angle: number) {
        this.rotate(MMath.toRad(angle));
    }
    rotateToDeg(angle: number) {
        this.rotateTo(MMath.toRad(angle));
    }
    clean() {
        this.xT = 0;
        this.yT = 0;
        this.prY = 0;
        this.prX = 0;
        this.pmY = 0;
        this.pmX = 0;
        this.sXT = 1;
        this.sYT = 1;
        this.angle = 0;
        this.relRotP = true;
        this.mirrorX = false;
        this.mirrorY = false;
    }
    mirrorHorizontal(mirror: boolean) {
        this.mirrorX = mirror;
    }
    mirrorVertical(mirror: boolean) {
        this.mirrorY = mirror;
    }
    setPivotRot(x: number, y: number, relative?: boolean) {
        if (typeof relative == "boolean" && relative == false) {
            this.relRotP = false;
            this.prX = x;
            this.prY = y;
        } else {
            this.prX = x - 0.5;
            this.prY = y - 0.5;
            this.relRotP = true;
        }
    }
    setPivotMove(x: number, y: number) {
        this.pmX = x;
        this.pmY = y;
    }
    getWidth(): number {
        return this.width * this.sXT;
    }
    getHeight(): number {
        return this.height * this.sYT
    }
}

interface GrixC {
    transform: Mat4;
}

abstract class TexturedGrix extends Grix {
    protected minX = Math.min();
    protected minY = Math.min();
    protected maxX = Math.max();
    protected maxY = Math.max();
    protected cound: number = 0;

    protected start() {
        super.start();
        this.getImg().bind()
    }

    protected getIndieces(indiec: number[], cound: number): number[] {
        indiec.forEach((val: number, index: number, array: number[]) => {
            array[index] = val + cound * 4;
        })
        return indiec;
    }

    populate(): TexturedGrix {
        this.height = Math.abs(this.maxY - this.minY)
        this.width = Math.abs(this.maxX - this.minX)

        this.getImg().onLoaded(() => {
            super.populate()
        });
        return this;
    }

    getShader(): Shader {
        return !this.customeShader ? Plena.getBasicShader(Plena.ShaderType.TEXTURE) : this.customeShader;
    }

    isLoaded(): boolean {
        return this.getImg().loaded();
    }

    addRect(width: number, height: number, x: number, y: number) {
        this.drawer.pushVerts([x, y, x + width, y, x + width, y + height, x, y + height]);
        this.drawer.pushIndices(0, this.getIndieces([0, 1, 3, 1, 2, 3], this.cound));

        this.minX = Math.min(x, this.minX);
        this.maxX = Math.max(width + x, this.maxX);
        this.minY = Math.min(y, this.minY);
        this.maxY = Math.max(height + y, this.maxY);
        this.cound++;
    }

    abstract getImg():Img;
}

class ImgGrix extends TexturedGrix {
    protected texture: Img;

    add(width: number, height: number, img: Img, x: number = 0, y: number = 0): ImgGrix {
        if (this.texture != null && this.texture != img)Plena.log("You cannot use different texture files in one ImgGrix!")
        else this.texture = img;

        img.onLoaded(() => {
            let coord = img.getCoord();
            this.drawer.pushUV([coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
        });

        this.addRect(width, height, x, y)

        return this;
    }

    fromTexture(img: Img, width?:number, height?:number): ImgGrix {
        img.onLoaded(() => {
            this.add(width ? width : img.getWidth(), height ? height : img.getHeight(), img)
            this.populate();
        });
        return this;
    }

    getImg(): Img {
        return this.texture;
    }

    populate(): ImgGrix {
        super.populate();
        return this;
    }
}

namespace Grix {
    export function fromTexture(img: Img | Sprite, width?:number, height?:number): ImgGrix;
    export function fromTexture(img: CanvasRenderingContext2D | HTMLCanvasElement, options?: TextureOptions, width?: number, height?: number): ImgGrix;
    export function fromTexture(img: Img | Sprite | CanvasRenderingContext2D | HTMLCanvasElement, options?: TextureOptions, width?: number, height?: number): ImgGrix {        
        return new ImgGrix().fromTexture(toImg(img, options), width, height);
    }

    function toImg(img: Img | Sprite | CanvasRenderingContext2D | HTMLCanvasElement, options:TextureOptions):Img {
        if ((img as Img).getCoord) return img as Img;
        else if ((img as Sprite).getBaseImg) return (img as Sprite).getBaseImg();
        else {
            let canvas = (img as CanvasRenderingContext2D).canvas;
            if (!canvas) canvas = img as HTMLCanvasElement;

            return Assets.getTexture(canvas, options)
        }
    }
}

class WritableGrix extends ImgGrix {
    private writable: WritableImg;
    private color: AColor;
    private oldColor: AColor;
    private wX:number = 0;
    private wY: number = 0;
    private pwX: number = 0;
    private pwY: number = 0;
    private alpha: number;

    constructor(tex: WritableImg, customShader?: Shader) {
        super(customShader);
        this.writable = tex;
        this.texture = tex.getImg();
    }

    startWrite() {
        this.writable.startWrite();
        if (this.color) {
            this.oldColor = Plena.getCurrCol();
            Plena.setColor(this.color);
        }
    }

    endWrite() {
        this.writable.stopWrite();
        if (this.color) Plena.setColor(this.oldColor)
    }

    moveWirte(x: number, y: number) {
        this.moveTo(this.wX + x, this.wY + y);
    }
    moveWirteTo(x: number, y: number) {
        this.moveWirteXTo(x);
        this.moveWirteYTo(y);
    }
    moveWirteXTo(x: number) {
        this.wX = x - this.writable.getWidth() * this.pwX;
        this.writable.x = this.wX;
    }
    setBackground(color: AColor) {
        this.color = color;
    }
    moveWirteYTo(y: number) {
        this.wY = y - this.writable.getHeight() * this.pwY;
        this.writable.y = this.wY;
    }
    setPivotWirte(x: number, y: number) {
        this.pwX = x;
        this.pwY = y;
    }
    clean() {
        super.clean();
    }

    populate(): WritableGrix {
        super.populate();
        return this;
    }
}

namespace Grix {
    export function writable(img: WritableImg): WritableGrix {
        return new WritableGrix(img).fromTexture(img.getImg()) as WritableGrix;
    }
}

class SpriteGrix extends TexturedGrix {
    private texture: Sprite;

    private anime: string;
    private img: string;
    private defaultAnime: string;
    private defaultImg: string;
    private step: number = 0;

    constructor(sprite: Sprite, customShader?: Shader) {
        super(customShader);
        this.texture = sprite;

        sprite.onLoaded(() => {
            if (sprite.hasSubImg()) this.activeImg(sprite.arbImgName());
            else if (sprite.hasAnime()) this.activeAnime(sprite.arbAnimName());
            else Plena.log("No sub images or animations found in sprite file!");
        })
    }

    add(width: number, height: number, x: number = 0, y: number = 0): SpriteGrix {
        this.drawer.pushUV([0, 0, 1, 0, 1, 1, 0, 1]);
        this.addRect(width, height, x, y)

        return this;
    }

    fromSprite(width?:number, height?:number): SpriteGrix {
        this.texture.onLoaded(() => {
            let img = this.defaultImg ? this.texture.getImg(this.defaultImg) : this.texture.getAnim(this.defaultAnime)[0];

            this.add(width ? width : img.getWidth(), height ? height : img.getHeight());
            this.populate();
        });
        return this;
    }

    getImg(): Img {
        return this.texture.getBaseImg();
    }

    clean() {
        super.clean();

        this.step = 0;
        this.img = this.defaultImg;
        this.anime = this.defaultAnime;
    }

    activeImg(img: string): SpriteGrix {
        if (this.isFinal) this.img = img;
        else this.defaultImg = img;

        this.anime = null;
        this.defaultAnime = null;
        return this;
    }
    activeAnime(anime: string): SpriteGrix {
        if (this.isFinal) this.anime = anime;
        else this.defaultAnime = anime;

        this.img = null;
        this.defaultImg = null;
        return this;
    }
    animeStep(step: number) {
        if (this.anime == null) Plena.log("Cannot set animation setp, no active animation was set");
        else this.step = step % this.texture.getAnim(this.anime).length;
    }
    protected createGrixc(transform: Mat4): GrixC {
        let child: SpriteGrixC = { transform: transform, img: this.img, anime: this.anime, step: this.step }
        return child;
    }
    protected doRender(grixC: GrixC) {
        let child: SpriteGrixC = grixC as SpriteGrixC;

        if (child.anime != null || child.img != null) {
            let coords = (child.anime == null ? this.texture.getImg(child.img) : this.texture.getAnim(child.anime)[child.step]).getCoord();
            let width = coords.getXMax() - coords.getXMin();
            let height = coords.getYMax() - coords.getYMin();
            let mat = [width, 0, 0, 0, 0, height, 0, 0, 0, 0, 1, 0, coords.getXMin(), coords.getYMin(), 0, 1];

            this.getShader().getMatHandler().setUVMatrix(mat);
            this.drawer.drawElements(0, this.mode)
        } else Plena.log("AnimeGrix has no active animation or image! Maybe you fotgot to setup your sprite?")
    }
    populate(): SpriteGrix {
        super.populate();
        return this;
    }
    protected end() {
        super.end();
        this.getShader().getMatHandler().setUVMatrix(Matrix4.identity());
    }
}

interface SpriteGrixC extends GrixC {
    img: string;
    anime: string;
    step: number;
}

namespace Grix {
    export function fromSprite(sprite: Sprite, width?:number, height?:number): SpriteGrix {
        return new SpriteGrix(sprite).fromSprite(width, height);
    }
}

//slow for many, two new types try, one mk textue of text and store than draw tex, two mk render of text and just draw.
class TextGrix extends SpriteGrix {
    private fontMap: FontMap;
    private yOffset: number = 0;
    private xOffset: number = 0;

    //align in tecxt grid, espcially for goood move transforms
    constructor(fontMap: FontMap, customShader?: Shader) {
        super(fontMap.getMap(), customShader);
        this.add(1, 1);
        this.populate();

        this.fontMap = fontMap;
    }

    fontsize(px: number) {
        var size = px / this.fontMap.defaultSize();
        this.scaleTo(size, size);
    }

    offsetY(offset: number) {
        this.yOffset = offset;
    }

    offsetX(offset: number) {
        this.xOffset = offset;
    }

    storeText(id: number, text: string, maxWidth: number = -1) {
        //stores text for future draw
    }

    cleanText(id: number) {

    }

    drawText(id:number) {

    }

    text(text: number, maxWidth: number = -1) {
        //stores text but discards them the first time the text is not drawn during a render
    }

    clean() {
        super.clean();
        this.yOffset = 0;
        this.xOffset = 0;
    }

    freeText(text: string, maxWidth: number = -1) {
        var x = this.xT;
        var y = this.yT;

        if (maxWidth != -1) {
            var textArr = text.split(" ");
            var width = 0;
            
            for (var i = 0; i < textArr.length; i++) {
                var tx = textArr[i];

                if (width > 0 && width + this.length(tx) > maxWidth) {
                    width = 0;
                    this.moveXTo(x)
                    this.move(0, (this.fontMap.getDim("a")[1] + this.yOffset) * this.sYT)
                    width += this.do_text(tx + " ");
                } else {
                    width += this.do_text(tx + " ");
                }               
            }
        } else {
            this.do_text(text);
        }
    }

    private length(text: string): number {
        var length = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            length += this.fontMap.getDim(char)[0] * this.sXT + this.xOffset;
        }
        return length;
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

    private do_text(text: string): number {
        var dX = this.sXT;
        var dY = this.sYT;

        var widthTotal = 0;
        for (var i = 0; i < text.length; i++) {
            var a = text.charAt(i);
            if (a == " ") {
                this.move(this.fontMap.spacing() * dX + this.xOffset, 0);
                widthTotal += this.fontMap.spacing() * dX + this.xOffset;
            } else {
                var dim = this.fontMap.getDim(a);
                var height = dim[1];
                var width = dim[0];

                this.activeImg(a);
                this.scaleToSize(width * dX, height * dY)
                this.render();
                this.move(width * dX + this.xOffset, 0);
                widthTotal += width * dX + this.xOffset;
            }
        }

        this.scaleTo(dX, dY);
        return widthTotal;
    }
}

namespace Grix {
    export function text(text: string, font: Font, options: TextureOptions = Assets.LETTERS, maxWidth: number = -1, offset: number = 0, background?: Color): ImgGrix {
        return Grix.fromTexture(Assets.mkTextImg(text, font, options, maxWidth, offset, background))
    }

    export function fromFontMap(fontMap: FontMap) {
        return new TextGrix(fontMap);
    }
}

class ShapeGrix extends Grix {
    //indieces with id system maybe or so, indieces draw range, max.
    //draw mode change whenever, also durign draw with clean and grixc
    //draw offset affecting all x and y coords
    private indiece: number = 0;
    private minX = Math.min();
    private minY = Math.min();
    private maxX = Math.max();
    private maxY = Math.max();
    private color: AColor;
    private colorDefault: AColor = Color.Gray.black();

    constructor(drawMode: number)
    constructor(drawMode: number, shader: Shader)
    constructor(drawMode: number, shader?: Shader) {
        super(shader)
        this.mode = drawMode;
    }

    populate(): ShapeGrix {
        this.height = Math.abs(this.maxY - this.minY)
        this.width = Math.abs(this.maxX - this.minX)
        super.populate();
        return this;
    }

    getShader(): Shader {
        return !this.customeShader ? Plena.getBasicShader(Plena.ShaderType.COLOR) : this.customeShader;
    }

    setColor(color: AColor): ShapeGrix {
        if (this.isFinal) this.color = color;
        else this.colorDefault = color;
        return this;
    }
    
    clean() {
        super.clean();
        this.color = this.colorDefault;
    }

    private setMaxMin(xl: number, xh: number, yl: number, yh: number) {
        this.setMaxMinX(xl, xh);
        this.setMaxMinY(yl, yh);
    }

    private setMaxMinX(xl: number, xh: number) {
        this.minX = Math.min(this.minX, xl);
        this.maxX = Math.max(this.maxX, xh);
    }

    private setMaxMinY(yl: number, yh: number) {
        this.minY = Math.min(this.minY, yl);
        this.maxY = Math.max(this.maxY, yh);
    }

    point(x: number, y: number): ShapeGrix {
        this.drawer.pushVerts([x, y])
        this.drawer.pushIndices(0, [this.indiece]);
        this.indiece += 1;

        this.setMaxMin(x, x, y, y);
        return this;
    }
    line(x: number, y: number, xo: number, yo: number) {

    }

    quad(width: number, height: number, x: number = 0, y: number = 0): ShapeGrix {
        this.drawer.pushVerts([x, y, x + width, y, x + width, y + height, x, y + height]);
        this.drawer.pushIndices(0, [this.indiece, this.indiece + 1, this.indiece + 3, this.indiece + 1, this.indiece + 2, this.indiece + 3]);

        this.setMaxMin(x, x+width, y, y+height)
        this.indiece += 4;
        return this;
    }

    ellipse(radiusX: number, radiusY: number, parts: number = 35, x: number = 0, y:number = 0): ShapeGrix {
        return this;
    }

    circle(radius: number, parts: number = 35, x:number = 0, y:number = 0): ShapeGrix {
        return this.ellipse(radius, radius, parts);
    }
    polygon(radius: number, corners: number): ShapeGrix {
        return this.circle(radius, corners);
    }

    drawMode() {

    }

    add(vertex: number[], indieces?: number[]): ShapeGrix {
        if ((vertex.length & 1) != 0) Plena.log("Uneven vertex coords supplied to drawer!")

        for (var i = 0; i < vertex.length; i++) {
            if ((i & 1) == 0) {
                this.setMaxMinX(vertex[i], vertex[i]);
            } else {
                this.setMaxMinY(vertex[i], vertex[i]);
            }
        }

        this.drawer.pushVerts(vertex);
        if (indieces) this.drawer.pushIndices(0, indieces);
        else {
            let ind:number[] = [];
            for (let i = vertex.length / 2; i > 0; i--) {
                ind.push(this.indiece + ((vertex.length / 2) - i))
            }
            this.indiece += vertex.length / 2;
            this.drawer.pushIndices(0, ind);
        }
        return this;
    }

    drawOffset() {

    }

    protected createGrixc(transform: Mat4): GrixC {
        let child: ColorGrixC = { transform: transform, color: this.color.vec() }
        return child;
    }
    protected doRender(grixC: GrixC) {
        let child: ColorGrixC = grixC as ColorGrixC;
        this.getShader().setVec4(Shader.Uniforms.COLOR, child.color)

        this.drawer.drawElements(0, this.mode)
    }
}

interface ColorGrixC extends GrixC {
    color: number[];
}

namespace DrawModes {
    export const
        POINTS = 0,
        LINES = 1,
        LINES_LOOP = 2,
        LINES_STRIP = 3,
        TRIANGLES = 4,
        TRIANGLE_STRIP = 5,
        TRIANGLE_FAN = 6;
}

namespace Grix {
    export function shape(drawMode: number): ShapeGrix {
        return new ShapeGrix(drawMode);
    }
}