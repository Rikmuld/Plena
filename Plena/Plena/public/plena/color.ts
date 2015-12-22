class Color {
    private rV: number;
    private gV: number;
    private bV: number;

    constructor(r: number, g: number, b: number);
    constructor(color: Vec);
    constructor(hex: string);
    constructor(par1: number | Vec | string, g?: number, b?: number) {
        if (typeof b == 'number') {
            this.rV = par1 as number;
            this.gV = g;
            this.bV = b;
        } else {
            let color: Vec;
            if (typeof par1 == 'string') {
                color = Color.toRGB(par1 as string);
            } else color = par1 as Vec;

            this.rV = color[0] * 255;
            this.bV = color[1] * 255;
            this.gV = color[2] * 255;
        }
    }

    r(): number {
        return this.rV;
    }

    b(): number {
        return this.bV;
    }

    g(): number {
        return this.gV;
    }

    style(a: number = 1): string {
        return `rgba(${this.rV}, ${this.gV}, ${this.bV}, ${a})`
    }

    vec(a: number = 1): Vec {
        return [this.rV / 255, this.gV / 255, this.bV / 255, 1]
    }

    hex(): string {
        return Color.toHex(this.rV, this.gV, this.bV)
    }

    static toRGB(hex: string): Vec3 {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }

    private static componentToHex(c: number): string {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    static toHex(r: number, g: number, b: number): string {
        return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
    }
}

namespace Color {
    export namespace Pink {
        export const
            PINK = new Color(255, 192, 203),
            PINK_LIGHT = new Color(255, 182, 193),
            PINK_HOT = new Color(255, 105, 180),
            PINK_DEEP = new Color(255, 20, 147),
            VIOLET_RED_PALE = new Color(219, 112, 147),
            VIOLET_RED_MEDIUM = new Color(199, 21, 133);
    }

    export namespace Red {
        export const
            SALMON_LIGHT = new Color(255, 160, 122),
            SALMON = new Color(250, 128, 114),
            SALMON_DARK = new Color(233, 150, 122),
            CORAL_LIGHT = new Color(240, 128, 128),
            RED_INDIAN = new Color(205, 92, 92),
            CRIMSON = new Color(220, 20, 60),
            FIREBRIK = new Color(178, 34, 34),
            RED_DARK = new Color(139, 0, 0),
            RED = new Color(255, 0, 0);
    }

    export namespace Orange {
        export const
            ORANGE_RED = new Color(255, 69, 0),
            TOMATO = new Color(255, 99, 71),
            CORAL = new Color(255, 127, 80),
            ORANGE_DARK = new Color(255, 140, 0),
            ORANGE = new Color(255, 165, 0);
    }

    export namespace Yellow {
        export const
            YELLOW = new Color(255, 255, 0),
            YELLOW_LIGHT = new Color(255, 255, 224),
            LEMON_CHIFFON = new Color(255, 250, 205),
            GOLDENROD_YELLO_LIGHT = new Color(250, 250, 210),
            PAPAYA_WHIP = new Color(255, 239, 213),
            MOCCASIN = new Color(255, 228, 181),
            PEACH_PUFF = new Color(255, 218, 185),
            GOLDENROD_PALE = new Color(238, 232, 170),
            KHAKI = new Color(240, 230, 140),
            KHAKI_DARK = new Color(189, 183, 107),
            GOLD = new Color(255, 215, 0);
    }

    export namespace Brown {
        export const
            CORNSILK = new Color(255, 248, 220),
            ALMOND_BLANCHED = new Color(255, 235, 205),
            BISQUE = new Color(255, 228, 196),
            NAVAJO_WHITE = new Color(255, 222, 173),
            WHEAT = new Color(245, 222, 179),
            WOOD_BLURY = new Color(222, 184, 135),
            TAN = new Color(210, 180, 140),
            BROWN_ROSY = new Color(188, 143, 143),
            BROWN_SANDY = new Color(244, 164, 96),
            GOLDENROD = new Color(218, 165, 32),
            GOLDENROD_DARK = new Color(184, 134, 11),
            PERU = new Color(205, 133, 63),
            CHOCOLATE = new Color(210, 105, 30),
            BROWN_SADDLE = new Color(139, 69, 19),
            SIENNA = new Color(160, 82, 45),
            BROWN = new Color(165, 42, 42),
            MAROON = new Color(128, 0, 0);
    }

    export namespace Green {
        export const
            OLIVE_GREEN_DARK = new Color(),
            OLIVE = new Color(),
            OLIVE_DRAB = new Color(),
            YELLOW_GREEN = new Color(),
            LIME_GREEN = new Color(),
            LIME = new Color(),
            GREEN_LAWN = new Color(),
            CHARTEUSE = new Color(),
            GREEN_YELLOW = new Color(),
            GREEN_SPRING = new Color(),
            GREEN_SPRING_MEDIUM = new Color(),
            GREEN_LIGHT = new Color(),
            GREEN_PALE = new Color(),
            GREEN_SEA_DARK = new Color(),
            AQUAMARINE_MEDIUM = new Color(),
            GREEN_SEA_MEDIUM = new Color(),
            GREEN_SEA = new Color(),
            GREEN_FORREST = new Color(),
            GREEN = new Color(),
            GREEN_DARK = new Color(),
    }

    export namespace Cyan {
        export const
            AQUA = new Color(),
            CYAN = new Color(),
            CYAN_LIGHT = new Color(),
            TURQUOISE_PALE = new Color(),
            AQUARMARINE = new Color(),
            TURQUOISE = new Color(),
            TURQUOISE_MEDIUM = new Color(),
            TURQUOISE_DARK = new Color(),
            GREEN_SEA_LIGHT = new Color(),
            BLUE_CADET = new Color(),
            CYAN_DARK = new Color(),
            TEAL = new Color()
    }

    export namespace Blue {
        export const
            BLUE_STEEL_LIGHT = new Color(),
            BLUE_POWDER = new Color(),
            BLUE_LIGHT = new Color(),
            BLUE_SKY = new Color(),
            BLUE_SKY_LIGHT = new Color(),
            BLUE_SKY_DEEP = new Color(),
            BLUE_DODGER = new Color(),
            BLUE_CORNFLOWER = new Color(),
            BLUE_STEEL = new Color(),
            BLUE_ROYAL = new Color(),
            BLUE = new Color(),
            BLUE_MEDIUM = new Color(),
            BLUE_DARK = new Color(),
            NAVY = new Color(),
            BLUE_MIDNIGHT = new Color()
    }

    export namespace Purple {
        export const
            LAVENDAR = new Color(),
            THISTLE = new Color(),
            PLUM = new Color(),
            VIOLET = new Color(),
            ORCHID = new Color(),
            FUCHSIA = new Color(),
            MAGENTA = new Color(),
            ORCHID_MEDIUM = new Color(),
            PURPLE_MEDIUM = new Color(),
            VIOLET_BLUE = new Color(),
            VIOLET_DARK = new Color(),
            ORCHID_DARK = new Color(),
            MAGENTA_DARK = new Color(),
            PURPLE = new Color(),
            INDIGO = new Color(),
            BLUE_SLATE_DARK = new Color(),
            PURPLE_REBECCA = new Color(),
            BLUE_SLATE = new Color(),
            BLUE_SLATE_MEDIUM = new Color()
    }

    export namespace White {
        export const
            WHITE = new Color(),
            SNOW = new Color(),
            HONEYDEW = new Color(),
            MIND_CREAM = new Color(),
            AZURE = new Color(),
            BLUE_ALICE = new Color(),
            WHITE_GHOST = new Color(),
            WHITE_SMOKE = new Color(),
            SEASHELL = new Color(),
            BEIGE = new Color(),
            OLDLACE = new Color(),
            WHITE_FLORAL = new Color(),
            IVORY = new Color(),
            WHITE_ANTIQUE = new Color(),
            LINEN = new Color(),
            LAVENDER_BLUSH = new Color(),
            ROSE_MISTY = new Color()
    }

    export namespace Gray {
        export const
            GAINSBORO = new Color(),
            GRAY_LIGHT = new Color(),
            SILVER = new Color(),
            GRAY_DARK = new Color(),
            GRAY = new Color(),
            GRAY_DIM = new Color(),
            GRAY_SLATE_LIGHT = new Color(),
            GRAY_SLATE = new Color(),
            GRAY_SLATE_DARK = new Color(),
            BLACK = new Color()
    }
}