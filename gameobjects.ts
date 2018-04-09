import {Rect, Frame} from "./common";
import {Sprite,NewSprite,SprSelectActiveFrames,SprAddAction} from "./sprite.js";
//
// Return random int from 0 to n-1.
function randInt(n:number):number {
    return Math.floor(Math.random() * n);
}

const invAFrames = <Frame[]>[
[
    "0010000100",
    "0001001000",
    "0011111100",
    "0110110110",
    "1111111111",
    "1011111101",
    "1010000101",
    "0001001000",
], [
    "0010000100",
    "1001001001",
    "1011111101",
    "1110110111",
    "1111111111",
    "0011111100",
    "0010000100",
    "0100000010",
]];

const invBFrames = <Frame[]>[
[
    "0002222000",
    "0222222220",
    "2222222222",
    "2200220022",
    "2222222222",
    "0022002200",
    "0200220020",
    "0020000200",
], [
    "0002222000",
    "0222222220",
    "2222222222",
    "2200220022",
    "2222222222",
    "0022002200",
    "0020220200",
    "2200000022",
]];

const invCFrames = <Frame[]>[
[
    "0000330000",
    "0003333000",
    "0033333300",
    "0330330330",
    "0333333330",
    "0030330300",
    "0300000030",
    "0030000300",
], [
    "0000330000",
    "0003333000",
    "0033333300",
    "0330330330",
    "0333333330",
    "0003003000",
    "0030330300",
    "0303003030",
]];

const shipFrames = <Frame[]>[
[
    "0004000",
    "0444440",
    "4444444",
    "4444444",
]];

const shipMissileFrames = <Frame[]>[
[
    "050",
    "050",
    "050",
    "050",
]];

const invMissileFrames = <Frame[]>[
[
    "0060",
    "0600",
    "0060",
    "0600",
]];

const invDebrisFrames = <Frame[]>[
[
    "0000000000",
    "0000000000",
    "0000000000",
    "0000870000",
    "0007777000",
    "0000787000",
    "0000000000",
    "0000000000",
],[
    "0000000000",
    "0000000000",
    "0000000000",
    "0000780000",
    "0008777000",
    "0000778000",
    "0000000000",
    "0000000000",
]];
const shipDebrisFrames = <Frame[]>[
[
    "0000000",
    "0077000",
    "0777700",
    "7777770",
],[
    "0000000",
    "0000000",
    "0077000",
    "0777700",
]];
const msDebrisFrames = <Frame[]>[
[
    "7007",
    "0707",
    "0700",
    "0007",
],[
    "0007",
    "7070",
    "7000",
    "0077",
]];

const invFramesTable = {
    "default": invAFrames,
    "B": invBFrames,
    "C": invCFrames,
};
const shipFramesTable = {
    "default": shipFrames,
};
const shipMissileFramesTable = {
    "default": shipMissileFrames,
};
const invMissileFramesTable = {
    "default": invMissileFrames,
};
const invDebrisFramesTable = {
    "default": invDebrisFrames,
};
const shipDebrisFramesTable = {
    "default": shipDebrisFrames,
};
const msDebrisFramesTable = {
    "default": msDebrisFrames,
};

function NewInv(invType:string, x:number, y:number):Sprite {
    const spr = NewSprite(invFramesTable);
    if (invType == "A") {
        SprSelectActiveFrames(spr, "A");
        spr.MsPerFrame = 800;
    } else if (invType == "B") {
        SprSelectActiveFrames(spr, "B");
        spr.MsPerFrame = 500;
    } else {
        SprSelectActiveFrames(spr, "C");
        spr.MsPerFrame = 200;
    }
    spr.x = x;
    spr.y = y;
//    SprAddAction(spr, "move", fnInvLateralMovement);
    return spr;
}

function NewShip(x:number, y:number):Sprite {
    const spr = NewSprite(shipFramesTable);
    spr.x = x;
    spr.y = y;
    return spr;
}

function NewShipMissile(x:number, y:number):Sprite {
    const spr = NewSprite(shipMissileFramesTable);
    spr.x = x;
    spr.y = y;
    return spr;
}

function NewInvMissile(x:number, y:number):Sprite {
    const spr = NewSprite(invMissileFramesTable);
    spr.x = x;
    spr.y = y;
    return spr;
}

function fnInvLateralMovement(inv:Sprite, msElapsed:number):boolean {
    const dx = 2;
    if (msElapsed >= 400) {
        inv.x += dx;
        return true;
    }
    return false;
}

function NewInvDebris(x:number, y:number):Sprite {
    const spr = NewSprite(invDebrisFramesTable, 200);
    spr.x = x;
    spr.y = y;
    return spr;
}
function NewShipDebris(x:number, y:number):Sprite {
    const spr = NewSprite(shipDebrisFramesTable, 200);
    spr.x = x;
    spr.y = y;
    return spr;
}
function NewMissileDebris(x:number, y:number):Sprite {
    const spr = NewSprite(msDebrisFramesTable, 200);
    spr.x = x;
    spr.y = y;
    return spr;
}

export {
    NewInv,
    NewShip,
    NewShipMissile,
    NewInvMissile,
    NewInvDebris,
    NewShipDebris,
    NewMissileDebris,
};

