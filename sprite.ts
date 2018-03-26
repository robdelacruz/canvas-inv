/*
Sprite
------
constructor(frameSeqs:{[k:string]:FrameSeq}, msPerFrame = 0) {
Rect():Rect
CurrentFrame():Frame
NextFrame()
SelectActiveFrames(framesID:string):boolean

Animate()
Update()
AddAction(actionID:string, fn:ActionCB)

*/

import {Frame, Rect} from "./common";

interface ActionCB {
    (sp:Sprite, msElapsed:number): boolean;
}
type FramesMap={[framesID:string]:Frame[]};
type ActionsMap={[actionID:string]:ActionCB};

class Sprite {
    x: number;
    y: number;
    FramesTable: FramesMap;
    iFrame: number;
    activeFrames: Frame[];

    MsPerFrame: number;     // milliseconds per cell frame
    lastAnimateTime: number;  // last animate time

    ActionsTable: ActionsMap;
    lastActionTime: {[k:string]:number};

    Props: {[k:string]:string};

    constructor(framesTable:FramesMap, msPerFrame = 0) {
        this.MsPerFrame = msPerFrame;

        this.FramesTable = framesTable;
        let activeFrames = framesTable["default"];
        if (activeFrames == null) {
            // No "default" frames, so select the first available frame set
            // in the table as the active frames.
            for (const k in framesTable) {
                activeFrames = framesTable[k];
                break;
            }
        }
        this.activeFrames = activeFrames || [];
        if (this.activeFrames.length > 0) {
            this.iFrame = 0;
        } else {
            this.iFrame = -1;
        }

        this.x = 0;
        this.y = 0;
        this.lastAnimateTime = new Date().getTime();

        this.ActionsTable = {};
        this.lastActionTime = {};

        this.Props = {};
    }

    Rect():Rect {
        const frame = this.CurrentFrame();
        let rect = <Rect>{
            x: this.x,
            y: this.y,
            w: 0,
            h: frame.length,
        };

        if (frame.length > 0) {
            rect.w = frame[0].length;
        }
        return rect;
    }
    CurrentFrame():Frame {
        // No active frames.
        if (this.iFrame == -1 || this.activeFrames.length == 0) {
            return [];
        }

        return this.activeFrames[this.iFrame % this.activeFrames.length];
    }
    NextFrame() {
        this.iFrame++;
        this.iFrame = this.iFrame % this.activeFrames.length;
    }
    SelectActiveFrames(framesID:string):boolean {
        if (this.FramesTable[framesID] == null) {
            return false;
        }

        this.activeFrames = this.FramesTable[framesID];
        if (this.activeFrames.length > 0) {
            this.iFrame = 0;
        } else {
            this.iFrame = -1;
        }
        return true;
    }

    Animate() {
        if (this.MsPerFrame == null || this.MsPerFrame == 0) {
            return;
        }

        const msNow = new Date().getTime();
        const msElapsed = msNow - this.lastAnimateTime;
        if (msElapsed >= this.MsPerFrame) {
            this.NextFrame();
            this.lastAnimateTime = msNow;
        }
    }

    Update() {
        const msNow = new Date().getTime();

        for (const actionID in this.ActionsTable) {
            let msLastTime = this.lastActionTime[actionID];
            if (msLastTime == null) {
                msLastTime = 0;
            }

            const msElapsed = msNow - msLastTime;
            const actionFn = this.ActionsTable[actionID];
            if (actionFn(this, msElapsed) == true) {
                this.lastActionTime[actionID] = msNow;
            }
        }
    }

    AddAction(actionID:string, fn:ActionCB) {
        this.ActionsTable[actionID] = fn;

        const msNow = new Date().getTime();
        this.lastActionTime[actionID] = msNow;
    }

}

export {Sprite};
