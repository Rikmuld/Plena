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
            OLIVE_GREEN_DARK = new Color(85, 107, 47),
            OLIVE = new Color(128, 128, 0),
            OLIVE_DRAB = new Color(107, 142, 35),
            YELLOW_GREEN = new Color(154, 205, 50),
            LIME_GREEN = new Color(50, 205, 50),
            LIME = new Color(0, 255, 0),
            GREEN_LAWN = new Color(124, 252, 0),
            CHARTEUSE = new Color(127, 255, 0),
            GREEN_YELLOW = new Color(173, 255, 47),
            GREEN_SPRING = new Color(0, 255, 127),
            GREEN_SPRING_MEDIUM = new Color(0, 250, 154),
            GREEN_LIGHT = new Color(144, 238, 144),
            GREEN_PALE = new Color(152, 251, 152),
            GREEN_SEA_DARK = new Color(143, 188, 143),
            AQUAMARINE_MEDIUM = new Color(102, 205, 170),
            GREEN_SEA_MEDIUM = new Color(60, 179, 113),
            GREEN_SEA = new Color(46, 139, 87),
            GREEN_FORREST = new Color(34, 139, 34),
            GREEN = new Color(0, 128, 0),
            GREEN_DARK = new Color(0, 100, 0);
    }

    export namespace Cyan {
        export const
            AQUA = new Color(0, 255, 255),
            CYAN = new Color(0, 255, 255),
            CYAN_LIGHT = new Color(224, 255, 255),
            TURQUOISE_PALE = new Color(175, 238, 238),
            AQUARMARINE = new Color(127, 255, 212),
            TURQUOISE = new Color(64, 224, 208),
            TURQUOISE_MEDIUM = new Color(72, 209, 204),
            TURQUOISE_DARK = new Color(0, 206, 209),
            GREEN_SEA_LIGHT = new Color(32, 178, 170),
            BLUE_CADET = new Color(95, 158, 160),
            CYAN_DARK = new Color(0, 139, 139),
            TEAL = new Color(0, 128, 128)
    }

    export namespace Blue {
        export const
            BLUE_STEEL_LIGHT = new Color(176, 196, 222),
            BLUE_POWDER = new Color(176, 224, 230),
            BLUE_LIGHT = new Color(173, 216, 230),
            BLUE_SKY = new Color(135, 206, 235),
            BLUE_SKY_LIGHT = new Color(135, 206, 250),
            BLUE_SKY_DEEP = new Color(0, 191, 255),
            BLUE_DODGER = new Color(30, 144, 255),
            BLUE_CORNFLOWER = new Color(100, 149, 237),
            BLUE_STEEL = new Color(70, 130, 180),
            BLUE_ROYAL = new Color(65, 105, 225),
            BLUE = new Color(0, 0, 255),
            BLUE_MEDIUM = new Color(0, 0, 205),
            BLUE_DARK = new Color(0, 0, 139),
            NAVY = new Color(0, 0, 128),
            BLUE_MIDNIGHT = new Color(25, 25, 112)
    }

    export namespace Purple {
        export const
            LAVENDAR = new Color(230, 230, 250),
            THISTLE = new Color(216, 191, 216),
            PLUM = new Color(221, 160, 221),
            VIOLET = new Color(238, 130, 238),
            ORCHID = new Color(218, 112, 214),
            FUCHSIA = new Color(255, 0, 255),
            MAGENTA = new Color(255, 0, 255),
            ORCHID_MEDIUM = new Color(186, 85, 211),
            PURPLE_MEDIUM = new Color(147, 112, 219),
            VIOLET_BLUE = new Color(138, 43, 226),
            VIOLET_DARK = new Color(148, 0, 211),
            ORCHID_DARK = new Color(153, 50, 204),
            MAGENTA_DARK = new Color(139, 0, 139),
            PURPLE = new Color(128, 0, 128),
            INDIGO = new Color(75, 0, 130),
            BLUE_SLATE_DARK = new Color(72, 61, 139),
            PURPLE_REBECCA = new Color(102, 51, 153),
            BLUE_SLATE = new Color(106, 90, 205),
            BLUE_SLATE_MEDIUM = new Color(123, 104, 238)
    }

    export namespace White {
        export const
            WHITE = new Color(255, 255, 255),
            SNOW = new Color(255, 250, 250),
            HONEYDEW = new Color(240, 255, 240),
            MIND_CREAM = new Color(245, 255, 250),
            AZURE = new Color(240, 255, 255),
            BLUE_ALICE = new Color(240, 248, 255),
            WHITE_GHOST = new Color(248, 248, 255),
            WHITE_SMOKE = new Color(245, 245, 245),
            SEASHELL = new Color(255, 245, 238),
            BEIGE = new Color(245, 245, 220),
            OLDLACE = new Color(253, 245, 230),
            WHITE_FLORAL = new Color(255, 250, 240),
            IVORY = new Color(255, 255, 240),
            WHITE_ANTIQUE = new Color(250, 235, 215),
            LINEN = new Color(250, 240, 230),
            LAVENDER_BLUSH = new Color(255, 240, 245),
            ROSE_MISTY = new Color(255, 228, 225)
    }

    export namespace Gray {
        export const
            GAINSBORO = new Color(220, 220, 220),
            GRAY_LIGHT = new Color(211, 211, 211),
            SILVER = new Color(192, 192, 192),
            GRAY_DARK = new Color(169, 169, 169),
            GRAY = new Color(128, 128, 128),
            GRAY_DIM = new Color(105, 105, 105),
            GRAY_SLATE_LIGHT = new Color(119, 136, 153),
            GRAY_SLATE = new Color(112, 128, 144),
            GRAY_SLATE_DARK = new Color(47, 79, 79),
            BLACK = new Color(0, 0, 0)
    }
}