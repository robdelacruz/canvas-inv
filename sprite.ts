/*
Functions
---------
rectsCollide(rect1:Rect, rect2:Rect):boolean

Types
-----
Sprite

Sprite
------
NewSprite(frameSeqs:{[k:string]:FrameSeq}, msPerFrame = 0):Sprite {
SprRect(spr):Rect
SprCurrentFrame(spr):Frame
SprNextFrame(spr)
SprSelectActiveFrames(spr, framesID:string):boolean

SprAnimate(spr)
SprUpdate(spr)
SprAddAction(spr, actionID:string, fn:ActionCB)

SprCheckCollision(spr, spr2:Sprite):boolean
SprCheckCollisionMultiple(spr, sprItems:Sprite[]):boolean

*/

import {Frame, Rect} from "./common";

type FramesMap={[framesID:string]:Frame[]};
interface ActionCB {
    (sp:Sprite, msElapsed:number): boolean;
}
type ActionsMap={[actionID:string]:ActionCB};

interface Sprite {
    x: number,
    y: number,
    FramesTable: FramesMap,
    iFrame: number,
    activeFrames: Frame[],

    MsPerFrame: number,     // milliseconds per cell frame
    lastAnimateTime: number,  // last animate time

    ActionsTable: ActionsMap,
    lastActionTime: {[k:string]:number},

    Props: {[id:string]:string},
}

function NewSprite(framesTable:FramesMap, msPerFrame = 0):Sprite {
    let spr = <Sprite>{};
    spr.MsPerFrame = msPerFrame;

    spr.FramesTable = framesTable;
    let activeFrames = framesTable["default"];
    if (activeFrames == null) {
        // No "default" frames, so select the first available frame set
        // in the table as the active frames.
        for (const k in framesTable) {
            activeFrames = framesTable[k];
            break;
        }
    }
    spr.activeFrames = activeFrames || [];
    if (spr.activeFrames.length > 0) {
        spr.iFrame = 0;
    } else {
        spr.iFrame = -1;
    }

    spr.x = 0;
    spr.y = 0;
    spr.lastAnimateTime = new Date().getTime();

    spr.ActionsTable = {};
    spr.lastActionTime = {};

    spr.Props = {};

    return spr;
}

function SprRect(spr:Sprite):Rect {
    const frame = SprCurrentFrame(spr);
    let rect = <Rect>{
        x: spr.x,
        y: spr.y,
        w: 0,
        h: frame.length,
    };

    if (frame.length > 0) {
        rect.w = frame[0].length;
    }
    return rect;
}

function SprCurrentFrame(spr:Sprite):Frame {
    // No active frames.
    if (spr.iFrame == -1 || spr.activeFrames.length == 0) {
        return [];
    }

    return spr.activeFrames[spr.iFrame % spr.activeFrames.length];
}
function SprNextFrame(spr:Sprite) {
    spr.iFrame++;
    spr.iFrame = spr.iFrame % spr.activeFrames.length;
}
function SprSelectActiveFrames(spr:Sprite, framesID:string):boolean {
    if (spr.FramesTable[framesID] == null) {
        return false;
    }

    spr.activeFrames = spr.FramesTable[framesID];
    if (spr.activeFrames.length > 0) {
        spr.iFrame = 0;
    } else {
        spr.iFrame = -1;
    }
    return true;
}

function SprAnimate(spr:Sprite) {
    if (spr.MsPerFrame == null || spr.MsPerFrame == 0) {
        return;
    }

    const msNow = new Date().getTime();
    const msElapsed = msNow - spr.lastAnimateTime;
    if (msElapsed >= spr.MsPerFrame) {
        SprNextFrame(spr);
        spr.lastAnimateTime = msNow;
    }
}

function SprUpdate(spr:Sprite) {
    const msNow = new Date().getTime();

    for (const actionID in spr.ActionsTable) {
        let msLastTime = spr.lastActionTime[actionID];
        if (msLastTime == null) {
            msLastTime = 0;
        }

        const msElapsed = msNow - msLastTime;
        const actionFn = spr.ActionsTable[actionID];
        if (actionFn(spr, msElapsed) == true) {
            spr.lastActionTime[actionID] = msNow;
        }
    }
}

function SprAddAction(spr:Sprite, actionID:string, fn:ActionCB) {
    spr.ActionsTable[actionID] = fn;

    const msNow = new Date().getTime();
    spr.lastActionTime[actionID] = msNow;
}

function SprCheckCollision(spr:Sprite, spr2:Sprite):boolean {
    const rect1 = SprRect(spr);
    const rect2 = SprRect(spr2);
    return rectsCollide(rect1, rect2);
}

function SprCheckCollisionMultiple(spr:Sprite, sprItems:Sprite[]):boolean {
    let i=1;
    const rect = SprRect(spr);
    for (const sprCheck of sprItems) {
        const rectCheck = SprRect(sprCheck);
        if (rectsCollide(rect, rectCheck)) {
            return true;
        }
        i++;
    }
    return false;
}

function rectsCollide(rect1:Rect, rect2:Rect):boolean {
    const Ax1 = rect1.x;
    const Ax2 = rect1.x + rect1.w;
    const Ay1 = rect1.y;
    const Ay2 = rect1.y + rect1.h;

    const Bx1 = rect2.x;
    const Bx2 = rect2.x + rect2.w;
    const By1 = rect2.y;
    const By2 = rect2.y + rect2.h;

    if (Ax1 < Bx2 &&
        Ax2 > Bx1 &&
        Ay1 < By2 &&
        Ay2 > By1) {
        return true;
    }
    return false;
}

export {
    Sprite,
    NewSprite,
    SprRect,
    SprCurrentFrame,
    SprNextFrame,
    SprSelectActiveFrames,
    SprAnimate,
    SprUpdate,
    SprAddAction,
    SprCheckCollision,
    SprCheckCollisionMultiple,
};
