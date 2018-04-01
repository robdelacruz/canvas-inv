/*
Types
-----
Graph

Graph
-----
NewGraph(cv:HTMLCanvasElement, wcell:number):Graph
GraphRect(g):Rect
GraphClear(g, pi:number)
GraphPlot(g, x,y:number, pi:number)
GraphDrawFrame(g, x,y:number, frame:Frame)
GraphDrawSprite(g, sp:Sprite)
GraphDrawText(g, x:number, y:number, s:string, fi:number, pi:number)

*/

import {Pos, Rect, Frame} from "./common";
import {Sprite,SprCurrentFrame} from "./sprite.js";

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

interface Graph {
    cv: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    wcell: number,
}

function NewGraph(cv:HTMLCanvasElement, wcell:number):Graph {
    let g = <Graph>{
        cv: cv,
        ctx: cv.getContext("2d"),
        wcell: wcell || 5,
    };
    return g;
}

function GraphRect(g:Graph):Rect {
    const cv = g.cv;
    return <Rect>{
        x: 0,
        y: 0,
        w: Math.floor(cv.width/g.wcell),
        h: Math.floor(cv.height/g.wcell),
    };
}

function GraphClear(g:Graph, pi:number) {
    const cv = g.cv;
    const ctx = g.ctx;

    ctx.fillStyle = Palette[pi];
    ctx.fillRect(0,0, cv.width, cv.height);
}

function GraphPlot(g:Graph, x:number, y:number, pi:number) {
    const wc = g.wcell;
    const ctx = g.ctx;

    ctx.fillStyle = Palette[pi];
    ctx.fillRect(x*wc, y*wc, wc, wc);
}

function GraphDrawFrame(g:Graph, x:number, y:number, frame:Frame) {
    const charCodeZero = "0".charCodeAt(0);
    const topx = x;
    const topy = y;

    for (let y=0; y < frame.length; y++) {
        const srow = frame[y];
        for (let x=0; x < srow.length; x++) {
            const pi = srow.charCodeAt(x) - charCodeZero;
            if (pi == 0) {
                continue;
            }
            GraphPlot(g, topx+x, topy+y, pi);
        }
    }
}

function GraphDrawSprite(g:Graph, spr:Sprite) {
    GraphDrawFrame(g, spr.x, spr.y, SprCurrentFrame(spr));
}

function GraphDrawText(g:Graph, x:number, y:number, s:string, fi:number, pi:number) {
    const wc = g.wcell;
    const ctx = g.ctx;

    ctx.font = Fonts[fi];
    ctx.fillStyle = Palette[pi];
    ctx.fillText(s, x*wc, y*wc);
}

export {
    Graph,
    NewGraph,
    GraphRect,
    GraphClear,
    GraphPlot,
    GraphDrawFrame,
    GraphDrawSprite,
    GraphDrawText,
};

