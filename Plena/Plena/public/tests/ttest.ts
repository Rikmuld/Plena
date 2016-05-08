module TTest {
    let draw: TextGrix
    let updater = 0
    let text = "Suspendisse nibh orci, porta vel ipsum in, pellentesque ornare velit. Proin condimentum, arcu ut commodo vulputate, ante magna facilisis lorem, quis posuere urna lectus condimentum risus. Morbi at pharetra libero, et blandit purus. Morbi elementum eros tellus, ac finibus neque mattis a. Donec pulvinar pretium sodales. Vestibulum eget mi eget eros facilisis tincidunt. Quisque vehicula hendrerit nunc eu varius. Proin lacinia odio a turpis varius mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus fringilla imperdiet elementum. Vestibulum tristique rutrum scelerisque. Vestibulum consequat, enim consectetur egestas sagittis, elit elit tempus arcu, sed facilisis nulla dui congue libero. Aenean non velit in lacus laoreet semper. Pellentesque vitae feugiat dui. Nulla dignissim vestibulum tristique."

    export function setup() {
        draw = Grix.fromFontMap(Assets.mkFontMap(new Font(Font.ARIAL, 24).fill(Color.Gray.black(1))))
    }
    export function update(delta: number) {
        updater += delta/10
    }
    export function render(delta: number) {
        draw.freeText(text.substring(0, Math.floor(updater / 2)), 600)
    }
}

Plena.init(TTest.setup, TTest.render, TTest.update, 600, 600, Color.White.white(1));