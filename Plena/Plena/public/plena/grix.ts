//more draw modes (not fill shape but only a border, or a shape witha border, different colors, gradients etc..)
//maybe key over or click events
//add curves
//texture mapping for shapes
//self made shape with moveto (also texture mapping)
//canvas driven graphix as alternative
//fix render
//test time of canvas driven render vs grix

abstract class Grix {
    protected mode = gl.TRIANGLES;
    protected drawer = new Render();

    protected customeShader: Shader;
    protected matrix: MatrixHandler;

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
            this.matrix = this.customeShader.getMatHandler();
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
    protected abstract doRender(child: GrixC);
    populate() {
        this.drawer.populate(this.getShader());
        Plena.manager().addGrix(this.getShader(), this);
        this.isFinal = true;
        this.clean();
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

class ImgGrix extends Grix {
    private texture: Img;
    private id: number;
    private cound: number[] = [];
    private minX = Math.min();
    private minY = Math.min();
    private maxX = Math.max();
    private maxY = Math.max();

    add(width: number, height: number, img: Img, x: number = 0, y: number = 0, id: number = 0): ImgGrix {
        let count = this.cound[id];
        let drawer = this.drawer;

        if (!count) count = 0;

        this.drawer.pushVerts([x, y, x + width, y, x + width, y + height, x, y + height]);
        this.drawer.pushIndices(id, this.getIndieces(id, [0, 1, 3, 1, 2, 3], count));

        img.onLoaded(() => {
            let coord = img.getCoord();
            drawer.pushUV([coord.getXMin(), coord.getYMin(), coord.getXMax(), coord.getYMin(), coord.getXMax(), coord.getYMax(), coord.getXMin(), coord.getYMax()]);
        });

        this.minX = Math.min(x, this.minX);
        this.maxX = Math.max(width + x, this.maxX);
        this.minY = Math.min(y, this.minY);
        this.maxY = Math.max(height + y, this.maxY);

        this.texture = img;
        this.cound[id] = count + 1;

        return this;
    }

    fromTexture(img: Img): ImgGrix {
        img.onLoaded(() => {
            this.add(img.getWidth(), img.getHeight(), img)
            this.populate();
        });
        return this;
    }

    private getIndieces(id:number, indiec: number[], cound:number):number[] {
        indiec.forEach((val: number, index: number, array: number[]) => {
            array[index] = val + cound * 4;
        })
        return indiec;
    }

    populate(): ImgGrix {
        this.height = Math.abs(this.maxY - this.minY)
        this.width = Math.abs(this.maxX - this.minX)

        this.texture.onLoaded(() => {
            super.populate()
        });

        return this;
    }

    protected start() {
        super.start();
        this.texture.bind()
    }

    getShader():Shader {
        return !this.customeShader ? Plena.getBasicShader(Plena.ShaderType.TEXTURE) : this.customeShader;
    }

    protected doRender(child: GrixC) {
        this.drawer.drawElements((child as TexGrixC).element, this.mode)
    }

    setIndex(id:number) {
        this.id = id;
    }

    clean() {
        super.clean();
        this.id = 0;
    }

    isLoaded(): boolean {
        return this.texture.loaded();
    }

    protected createGrixc(transform: Mat4): GrixC {
        let grixC: TexGrixC = { transform: transform, element: this.id }
        return grixC;
    }
}

interface TexGrixC extends GrixC {
    element: number;
}

namespace Grix {
    export function fromTexture(img: Img | Sprite): ImgGrix;
    export function fromTexture(img: CanvasRenderingContext2D | HTMLCanvasElement, options?: TextureOptions): ImgGrix;
    export function fromTexture(img: Img | Sprite | CanvasRenderingContext2D | HTMLCanvasElement, options?: TextureOptions): ImgGrix {        
        return new ImgGrix().fromTexture(toImg(img, options));
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

    constructor(tex: WritableImg, customShader?: Shader) {
        super(customShader);
        this.writable = tex;
    }

    startWrite() {
        this.writable.startWrite();
    }

    endWrite() {
        this.writable.stopWrite();
    }
}

namespace Grix {
    export function writable(img: WritableImg): WritableGrix {
        return new WritableGrix(img).fromTexture(img.getImg()) as WritableGrix;
    }
}

//SpriteGrix(sprite) extends Grix
//    .add(width height ? x ? y)
//    .animeActive
//    .animeStep
//    .imgActive

//ShapeGrix(draw mode) extends Grix
//    .moveTo
//    .add(verts...)
//    .color
//    .ellipse
//    .rect
//    .circle
//    .line
//    .point
//    .tri

//WritableGrix(writableImg) extends ImgGrix
////ImgGrix which gets img from frame buffer and has write to funcs

//TextGrix(fontMap) extends SpriteGrix(fontMap.sprite)
////SpriteGrix where letters are in sprite and has method for drawing whole strings in one go (with options as align, fontsize, line break lenagth (if any), x/y spacing)