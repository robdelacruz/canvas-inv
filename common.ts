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

type Cell=number[][];
type CellSeq=Cell[];

export {Pos, Rect, Cell, CellSeq};
