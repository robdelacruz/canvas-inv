/*
Sprite
------
constructor(frameSeqs:{[k:string]:FrameSeq}, msPerFrame = 0) {
Rect():Rect
CurrentFrameSeq():FrameSeq {
CurrentFrame():Frame
NextFrame()

Animate()
Update()
AddAction(actionID:string, fn:ActionCB)
SelectFrameSeq(k:string):boolean

*/

import {Frame, FrameSeq, Rect} from "./common";

interface ActionCB {
    (sp:Sprite, msElapsed:number): boolean;
}

class Sprite {
    x: number;
    y: number;
    FrameSeqs: {[k:string]:FrameSeq};
    iFrame: number;
    curFrameSeq: FrameSeq;

    MsPerFrame: number;     // milliseconds per cell frame
    lastAnimateTime: number;  // last animate time

    Actions: {[k:string]:ActionCB};
    lastActionTime: {[k:string]:number};

    Props: {[k:string]:string};

    constructor(frameSeqs:{[k:string]:FrameSeq}, msPerFrame = 0) {
        this.MsPerFrame = msPerFrame;

        let curFrameSeq:FrameSeq = [[[0,],]];
        this.FrameSeqs = frameSeqs;
        if (this.FrameSeqs["default"] != null) {
            curFrameSeq = this.FrameSeqs["default"];
        } else {
            // No "default" frameseq, so select any other key.
            for (const k in this.FrameSeqs) {
                curFrameSeq = this.FrameSeqs[k];
                break;
            }
        }
        this.curFrameSeq = curFrameSeq;

        this.x = 0;
        this.y = 0;
        this.iFrame = 0;
        this.lastAnimateTime = new Date().getTime();

        this.Actions = {};
        this.lastActionTime = {};

        this.Props = {};
    }

    Rect():Rect {
        const frame = this.CurrentFrame();
        return <Rect>{
            x: this.x,
            y: this.y,
            w: frame[0].length,
            h: frame.length,
        };
    }
    CurrentFrame():Frame {
        return this.curFrameSeq[this.iFrame % this.curFrameSeq.length];
    }
    NextFrame() {
        this.iFrame++;
        this.iFrame = this.iFrame % this.curFrameSeq.length;
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

        for (const k in this.Actions) {
            let msLastTime = this.lastActionTime[k];
            if (msLastTime == null) {
                msLastTime = 0;
            }

            const msElapsed = msNow - msLastTime;
            const actionFn = this.Actions[k];
            if (actionFn(this, msElapsed) == true) {
                this.lastActionTime[k] = msNow;
            }
        }
    }

    AddAction(actionID:string, fn:ActionCB) {
        this.Actions[actionID] = fn;

        const msNow = new Date().getTime();
        this.lastActionTime[actionID] = msNow;
    }

    SelectFrameSeq(k:string):boolean {
        if (this.FrameSeqs[k] == null) {
            return false;
        }

        this.curFrameSeq = this.FrameSeqs[k];
        this.iFrame = 0;
        return true;
    }
}

export {Sprite};
