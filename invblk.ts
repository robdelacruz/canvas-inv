import {Pos,Rect} from "./common";
import {Sprite,NewSprite,SprRect} from "./sprite.js";
import {NewInv} from "./gameobjects.js";

interface InvBlk {
    pos: Pos,

    nInv: number,
    Rows: ((Sprite | null)[])[];
}

function invRect():Rect {
    const invTmpl = NewInv("A", 0,0);
    return SprRect(invTmpl);
}

const xInvSpace = 3;
const yInvSpace = 4;

function NewInvBlk(nRows:number, nCols:number, pos:Pos):InvBlk {
    const invblk = <InvBlk>{
        pos: pos,
        nInv: nRows * nCols,
    };

    let {w, h} = invRect();
    let wInv = w;
    let hInv = h;

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

    let {w, h} = invRect();
    let wInv = w;
    let hInv = h;

    let yInv = y;
    for (const invRow of invblk.Rows) {
        let xInv = x;
        for (const inv of invRow) {
            if (inv == null) {
                continue;
            }
            xInv += wInv + xInvSpace;
            inv.x = xInv;
            inv.y = yInv;
        }
        yInv += hInv + yInvSpace;
    }
}

export {
    InvBlk,
    NewInvBlk,
    InvBlkMove,
};

