/*
Graph
-----
new(ctx, wcell:number)
Rect():Rect
Clear(pi:number)
Plot(x,y:number, pi:number)
DrawFrame(x,y:number, frame:Frame)
DrawSprite(sp:Sprite)
DrawText(x:number, y:number, s:string, fi:number, pi:number)

*/

import {Pos, Rect, Frame} from "./common";
import {Sprite} from "./sprite";

const Palette:string[] = [
    "#000",     // [0]
    "#F33",     // 1
    "#5F5",     // 2
    "#77F",     // 3
    "#0FF",     // 4
    "#BBB",     // 5
    "#DDD",     // 6
];

const Fonts:string[] = [
    "25px Helvetica",
    "25px sans-serif",
];

class Graph {
    cv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    wcell: number;

    constructor(cv:HTMLCanvasElement, ctx:CanvasRenderingContext2D, wcell:number) {
        this.cv = cv;
        this.ctx = ctx;
        this.wcell = 5;

        if (wcell != null) {
            this.wcell = wcell;
        }
    }

    Rect():Rect {
        const cv = this.cv;
        return <Rect>{x:0, y:0, w:cv.width, h:cv.height};
    }

    Clear(pi:number) {
        const cv = this.cv;
        const ctx = this.ctx;

        ctx.fillStyle = Palette[pi];
        ctx.fillRect(0,0, cv.width, cv.height);
    }

    Plot(x:number, y:number, pi:number) {
        const wc = this.wcell;
        const ctx = this.ctx;

        ctx.fillStyle = Palette[pi];
        ctx.fillRect(x*wc, y*wc, wc, wc);
    }

    DrawFrame(x:number, y:number, frame:Frame) {
        const topx = x;
        const topy = y;

        for (let y=0; y < frame.length; y++) {
            const row = frame[y];
            for (let x=0; x < row.length; x++) {
                if (row[x] == 0) {
                    continue;
                }
                this.Plot(topx+x, topy+y, row[x]);
            }
        }
    }

    DrawSprite(sp:Sprite) {
        this.DrawFrame(sp.x, sp.y, sp.CurrentFrame());
    }

    DrawText(x:number, y:number, s:string, fi:number, pi:number) {
        const wc = this.wcell;
        const ctx = this.ctx;

        ctx.font = Fonts[fi];
        ctx.fillStyle = Palette[pi];
        ctx.fillText(s, x*wc, y*wc);
    }
}

export {Graph};

