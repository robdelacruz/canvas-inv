/*
Types
-----
Pos
Rect
Cell

*/

interface Pos {
    x: number,
    y: number,
}

interface Rect {
    x: number,
    y: number,
    w: number,
    h: number,
}

type Frame=string[];

export {Pos, Rect, Frame};
