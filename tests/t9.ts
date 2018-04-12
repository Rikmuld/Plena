module t9 {
   var cat: Grix;
   var marble: Grix;
   var cats: Grix;
   var field: Grix;

   var sound: AudioObj;

   export function setup() {
       cat = new Grix().fromTexture(Assets.loadImg("cat.png", Assets.PIXEL_NORMAL)).populate()
       marble = new Grix().fromTexture(Assets.loadImg("marbles.jpg", Assets.PIXEL_NORMAL)).populate()
       cats = new Grix().fromTexture(Assets.loadImg("cats.png", Assets.PIXEL_NORMAL)).populate()
       field = new Grix().fromTexture(Assets.loadImg("garfeld.png", Assets.PIXEL_NORMAL)).populate()

       sound = Assets.loadAudio("test.ogg");
       sound.play();
   }

   export function update(delta: number) {}

   export function render(delta: number) {
       cat.render();
       marble.render();
       cats.render();
       field.render();
   }
}

Plena.init(t9.setup, t9.render, t9.update, 500, 500, new Color(255, 200, 175));