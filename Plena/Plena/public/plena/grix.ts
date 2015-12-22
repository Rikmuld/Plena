////more draw modes (not fill shape but only a border, or a shape witha border, different colors, gradients etc..)
////maybe key over or click events
////add curves
////texture mapping for shapes
////self made shape with moveto (also texture mapping)
////canvas driven graphix as alternative
////fix render
////test time of canvas driven render vs grix

//namespace Test {
//    abstract class Grix {
//        private mode = gl.TRIANGLES;
//        private customeShader: Shader;
//        private matrix: MatrixHandler;
//        private drawer = new Render();
//        protected isFinal: boolean;
//        private childs = new Queue<GrixC>();
//        private width: number;
//        private height: number;
//        protected xT: number = 0;
//        protected yT: number = 0;
//        protected sXT: number = 1;
//        protected sYT: number = 1;
//        private angle: number = 0;
//        private pmX: number = 0;
//        private pmY: number = 0;
//        private prX: number = 0;
//        private prY: number = 0;
//        private relRotP: boolean = true;
//        private mirrorX: boolean = false;
//        private mirrorY: boolean = false;

//        constructor(customShader?: Shader) {
//            this.drawer = new Render();

//            if (customShader) {
//                this.customeShader = customShader;
//                this.matrix = this.customeShader.getMatHandler();
//                if (!Plena.manager().hasShader(customShader.getId())) Plena.manager().addShader(customShader);
//            }
//        }

//        protected start() {
//            this.drawer.start();
//        }
//        protected end() {
//            this.drawer.end();
//        }
//        private doRenderAll() {
//            this.start();
//            var size = this.childs.size();
//            for (var i = 0; i < size; i++) {
//                var child = this.childs.dequeue();
//                this.getShader().getMatHandler().setModelMatrix(child.transform);
//                this.doRender(child)
//            }
//            this.end();
//            this.clean();
//        }
//        protected abstract doRender(child: GrixC);
//        put(): Grix {
//            return this
//        }
//        abstract getShader(): Shader;
//        isLoaded():boolean {
//            return true;
//        }
//        render() {
//            //rotating and mirroring does not work together, I made something to have the displacement of mirroring to be corected, but I did not keep the rotation into account, so only angle==0 will work with mirroring, it does work with scaling
//            if (!this.isLoaded()) return;

//            var centerX = ((this.width * this.sXT) / 2);
//            var centerY = ((this.height * this.sYT) / 2);

//            var aC = Math.cos(this.angle)
//            var aS = Math.sin(this.angle)
//            var xTr = centerX + this.xT;
//            var yTr = centerY + this.yT;

//            var mX = (this.mirrorX ? -1 : 1);
//            var mY = (this.mirrorY ? -1 : 1);

//            var x2 = !this.relRotP ? - this.prX + this.xT : - centerX - this.prX * (centerX * 2);
//            var y2 = !this.relRotP ? -this.prY + this.yT : - centerY - this.prY * (centerY * 2);
//            var x3 = this.sXT * mX;
//            var y3 = this.sYT * mY;
//            var x1 = xTr + (this.mirrorX ? centerX * 2 : 0) + (!this.relRotP ? this.prX - xTr : this.prX * (centerX * 2)) + aC * x2 + -aS * y2;
//            var y1 = yTr + (this.mirrorY ? centerY * 2 : 0) + (!this.relRotP ? this.prY - yTr : this.prY * (centerY * 2)) + aS * x2 + aC * y2;

//            var transform = [aC * x3, aS * x3, 0, 0, -aS * y3, aC * y3, 0, 0, 0, 0, 1, 0, x1, y1, 0, 1];

//            this.childs.enqueue({ transform: transform });
//        }
//        move(x: number, y: number) {
//            this.xT += x;
//            this.yT += y;
//        }
//        moveTo(x: number, y: number) {
//            this.xT = x - (this.width * this.sXT) * this.pmX;
//            this.yT = y - (this.height * this.sYT) * this.pmY;
//        }
//        moveXTo(x: number) {
//            this.xT = x - (this.width * this.sXT) * this.pmX;
//        }
//        moveYTo(y: number) {
//            this.yT = y - (this.height * this.sYT) * this.pmY;
//        }
//        scale(x: number, y: number) {
//            this.sXT += x;
//            this.sYT += y;
//        }
//        scaleTo(x: number, y: number) {
//            this.sXT = x;
//            this.sYT = y;
//        }
//        scaleToSize(width: number, height: number) {
//            var x = width / this.width;
//            var y = height / this.height;
//            this.scaleTo(x, y);
//        }
//        scaleWidthToSize(width: number) {
//            var x = width / this.width;
//            this.scaleTo(x, x);
//        }
//        scaleHeightToSize(height: number) {
//            var y = height / this.height;
//            this.scaleTo(y, y);
//        }
//        rotate(angle: number) {
//            this.angle += angle;
//        }
//        rotateTo(angle: number) {
//            this.angle = angle;
//        }
//        rotateDeg(angle: number) {
//            this.rotate(MMath.toRad(angle));
//        }
//        rotateToDeg(angle: number) {
//            this.rotateTo(MMath.toRad(angle));
//        }
//        clean() {
//            this.xT = 0;
//            this.yT = 0;
//            this.prY = 0;
//            this.prX = 0;
//            this.pmY = 0;
//            this.pmX = 0;
//            this.sXT = 1;
//            this.sYT = 1;
//            this.angle = 0;
//            this.relRotP = true;
//            this.mirrorX = false;
//            this.mirrorY = false;
//        }
//        mirrorHorizontal(mirror: boolean) {
//            this.mirrorX = mirror;
//        }
//        mirrorVertical(mirror: boolean) {
//            this.mirrorY = mirror;
//        }
//        setPivotRot(x: number, y: number, relative?: boolean) {
//            if (typeof relative == "boolean" && relative == false) {
//                this.relRotP = false;
//                this.prX = x;
//                this.prY = y;
//            } else {
//                this.prX = x - 0.5;
//                this.prY = y - 0.5;
//                this.relRotP = true;
//            }
//        }
//        setPivotMove(x: number, y: number) {
//            this.pmX = x;
//            this.pmY = y;
//        }
//        getWidth(): number {
//            return this.width * this.sXT;
//        }
//        getHeight(): number {
//            return this.height * this.sYT
//        }
//    }

//    interface GrixC {
//        transform: Mat4;
//    }
//}


//Grix()
//    .transofmration shit for drawing
//    .draw
//    .put

//ImgGrix() extends Grix
//    .add(width height img/canvas ? x ? y)
//    .from(img/canvas ? x ? y)

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