window.onload = function () { QuickGL.initGL(SnakeExample.setup, SnakeExample.loop,(window.innerWidth - 800) / 2,(window.innerHeight - 800) / 2, 800, 800, [0.2, 0.2, 0.2, 1]) }

module SnakeExample {
    var shader: Shader;
    var SIPR: QuickGL.SIPRender;

    var entities: Entity[] = new Array(0);
    var snake: Snake;

    export function setup() {
        shader = QuickGL.createShader(QuickGL.ShaderType.COLOR);
        SIPR = new QuickGL.SIPRender(shader, QuickGL.StartType.ONCE);

        shader.matrix.setProjectionMatrix(Matrix4.ortho(0, 40, 40, 0));

        entities.push(new Pedal());
        snake = new Snake(20, 20);
   }

    export function loop() {
        update();
        render();
    }

    function update() {
        var entitiesClone = entities.slice(0);
        snake.update(0);
        for (var i = 0; i < entitiesClone.length; i++)entitiesClone[i].update(i);
    }

    function render() {
        GLF.clearBufferColor()

        for (var i = 0; i < entities.length; i++)entities[i].render();
        snake.render();

        SIPR.setColorRGB(0, 0, 0);
        for (var x = 0; x < 41; x++)SIPR.line(x, 0, x, 40);
        for (var y = 0; y < 41; y++)SIPR.line(0, y, 40, y);
    }

    class Entity {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        update(id: number) { }
        render() { }

        kill(id: number) {
            entities.splice(id, 1)
        }
    }

    class Snake extends Entity {
        direction: number = 0;
        currDirection: number = 0;
        timer: number = 0;
        length: number = 3;
        canPress: boolean = true;

        update(id: number) {
            var oldX = this.x;
            var oldY = this.y;

            if (this.currDirection != 2 && (Keyboard.isKeyDown(Keyboard.KEY_D) || Keyboard.isKeyDown(Keyboard.KEY_RIGHT))) this.direction = 0;
            else if (this.currDirection != 3 && (Keyboard.isKeyDown(Keyboard.KEY_S) || Keyboard.isKeyDown(Keyboard.KEY_DOWN))) this.direction = 1;
            else if (this.currDirection != 0 && (Keyboard.isKeyDown(Keyboard.KEY_A) || Keyboard.isKeyDown(Keyboard.KEY_LEFT))) this.direction = 2;
            else if (this.currDirection != 1 && (Keyboard.isKeyDown(Keyboard.KEY_W) || Keyboard.isKeyDown(Keyboard.KEY_UP))) this.direction = 3;

            if (this.timer == 10) {
                this.timer = 0;
                this.currDirection = this.direction;
                switch (this.direction) {
                    case 0:
                        this.x += 1;
                        break;
                    case 1:
                        this.y += 1;
                        break;
                    case 2:
                        this.x -= 1;
                        break;
                    case 3:
                        this.y -= 1;
                        break;
                }
                if (this.x < 0) this.x = 39;
                if (this.y < 0) this.y = 39;
                if (this.x >= 40) this.x = 0;
                if (this.y >= 40) this.y = 0;

                entities.push(new Block(oldX, oldY, this.length));
            }

            this.timer++;
        }

        render() {
            SIPR.setColorRGB(255, 0, 0);
            SIPR.rect(this.x, this.y, 1, 1);
        }

        kill(typ: number) {
            entities = new Array(0);
            snake = new Snake(20, 20);
            entities.push(new Pedal());
        }
    }

    class Block extends Entity {
        life: number;

        constructor(x, y, life) {
            super(x, y);

            this.life = life * 10;
        }

        update(id: number) {
            if (this.x == snake.x && this.y == snake.y) {
                snake.kill(0);
            }

            if (this.life <= 0) this.kill(id);
            this.life--;
        }

        render() {
            SIPR.setColorRGB(120, 90, 50);
            SIPR.rect(this.x, this.y, 1, 1);
        }
    }

    class Pedal extends Entity {
        constructor() {
            super(Math.floor((Math.random() * 40)), Math.floor((Math.random() * 40)))
        }

        render() {
            SIPR.setColorRGB(20, 180, 30);
            SIPR.rect(this.x, this.y, 1, 1);
        }

        update(id: number) {
            if (this.x == snake.x && this.y == snake.y) {
                this.kill(id);
                snake.length += 1;
            }
        }

        kill(id: number) {
            entities.splice(id, 1, new Pedal())
        }
    }
}