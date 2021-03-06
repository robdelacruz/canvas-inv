import {Pos,Rect} from "./common";
import {Sprite,NewSprite,SprRect} from "./sprite.js";
import {NewInv} from "./gameobjects.js";
import {ActionsTbl,ActionCB,NewActionsTbl,ActionsTblAddAction,ActionsTblUpdate} from "./actionstbl.js";

interface InvBlk {
    pos: Pos,

    nInv: number,
    Rows: ((Sprite | null)[])[],

    // helper props
    wInv: number,
    hInv: number,
    xInvSpace: number,
    yInvSpace: number,
}

function invRect():Rect {
    const invTmpl = NewInv("A", 0,0);
    return SprRect(invTmpl);
}

function NewInvBlk(nRows:number, nCols:number, pos:Pos):InvBlk {
    const xInvSpace = 3;
    const yInvSpace = 4;
    const invTmplRect = invRect();
    const wInv = invTmplRect.w;
    const hInv = invTmplRect.h;

    let invblk = <InvBlk>{};
    invblk.pos = pos;
    invblk.nInv = nRows * nCols;
    invblk.wInv = wInv;
    invblk.hInv = hInv;
    invblk.xInvSpace = xInvSpace;
    invblk.yInvSpace = yInvSpace;

    let rows = [];
    let yInv = pos.y;
    let invType = "A";
    for (let y=0; y < nRows; y++) {
        let xInv = pos.x;
        let row = [];
        for (let x=0; x < nCols; x++) {
            row.push(NewInv(invType, xInv, yInv));
            xInv += wInv + xInvSpace;
        }

        rows.push(row);
        yInv += hInv + yInvSpace;
        invType = invType=="A"? "B": invType=="B"? "C": "A";
    }
    invblk.Rows = rows;

    return invblk;
}

function InvBlkMove(invblk:InvBlk, x:number, y:number) {
    invblk.pos.x = x;
    invblk.pos.y = y;

    let yInv = y;
    for (const invRow of invblk.Rows) {
        let xInv = x;
        for (const inv of invRow) {
            if (inv != null) {
                inv.x = xInv;
                inv.y = yInv;
            }
            xInv += invblk.wInv + invblk.xInvSpace;
        }
        yInv += invblk.hInv + invblk.yInvSpace;
    }
}

function leftmostCol(row:any[]):number {
    for (let x=0; x < row.length; x++) {
        if (row[x] != null) {
            return x;
        }
    }
    return -1;
}
function rightmostCol(row:any[]):number {
    for (let x=row.length-1; x >= 0; x--) {
        if (row[x] != null) {
            return x;
        }
    }
    return -1;
}
function topmostRow(rows:any[][]):number {
    for (let y=0; y < rows.length; y++) {
        const row = rows[y];
        if (leftmostCol(row) != -1) {
            return y;
        }
    }
    return -1;
}
function bottommostRow(rows:any[][]):number {
    for (let y=rows.length-1; y >= 0; y--) {
        const row = rows[y];
        if (leftmostCol(row) != -1) {
            return y;
        }
    }
    return -1;
}

// Return all invs that have surface exposure from the bottom.
// (In other words, invs that aren't blocked by other invs down.)
function bottomSurface(rows:any[][]):any[] {
    let exposed = [];
    const rowLen = rows[0].length;

    for (let x=0; x < rowLen; x++) {
        for (let y=rows.length-1; y >= 0; y--) {
            const item = rows[y][x];
            if (item != null) {
                exposed.push(item);
                break;
            }
        }
    }

    return exposed;
}

function InvBlkExposed(invblk:InvBlk): Sprite[] {
    return bottomSurface(invblk.Rows);
}

// Return [top left, lower right] boundary positions.
function InvBlkBounds(invblk:InvBlk): Pos[] {
    const yTop = topmostRow(invblk.Rows);
    const yBottom = bottommostRow(invblk.Rows);
    if (yTop == -1 || yBottom == -1) {
        const pos0 = <Pos>{x:0, y:0};
        return [pos0, pos0];
    }

    let rowLen = invblk.Rows[0].length;
    let xLeft = rowLen-1;
    let xRight = 0;
    for (const row of invblk.Rows) {
        const leftmost = leftmostCol(row);
        if (leftmost != -1 && leftmost < xLeft) {
            xLeft = leftmost;
        }

        const rightmost = rightmostCol(row);
        if (rightmost != -1 && rightmost > xRight) {
            xRight = rightmost;
        }
    }

    const xInvSpace = invblk.xInvSpace;
    const yInvSpace = invblk.yInvSpace;
    const wInv = invblk.wInv;
    const hInv = invblk.hInv;

    const startPos = <Pos>{
        x: invblk.pos.x + (xLeft * (wInv+xInvSpace)) - xInvSpace,
        y: invblk.pos.y + (yTop * (hInv+yInvSpace)) - yInvSpace,
    };
    const endPos = <Pos>{
        x: invblk.pos.x + (xRight * (wInv+xInvSpace)) - xInvSpace + wInv,
        y: invblk.pos.y + (yBottom * (hInv+yInvSpace)) - yInvSpace + hInv,
    };
    return [startPos, endPos];
}

export {
    InvBlk,
    NewInvBlk,
    InvBlkMove,
    InvBlkExposed,
    InvBlkBounds,
};

