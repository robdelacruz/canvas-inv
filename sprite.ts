/*
Sprite
------
new(cell:number[][])
Rect():Rect
NextFrame()
CurrentCell():Cell

Animate()
Update()
AddAction(actionID:string, fn:ActionCB)

*/

import {Cell, Rect} from "./common";

interface ActionCB {
    (sp:Sprite, msElapsed:number): boolean;
}

class Sprite {
    x: number;
    y: number;
    cells: Cell[];
    iFrame: number;

    MsPerFrame: number;     // milliseconds per cell frame
    lastAnimateTime: number;  // last animate time

    Actions: {[k:string]:ActionCB};
    lastActionTime: {[k:string]:number};

    Props: {[k:string]:string};

    constructor(cells:Cell[], msPerFrame = 0) {
        this.cells = cells;
        this.MsPerFrame = msPerFrame;

        this.x = 0;
        this.y = 0;
        this.iFrame = 0;
        this.lastAnimateTime = new Date().getTime();

        this.Actions = {};
        this.lastActionTime = {};

        this.Props = {};
    }

    Rect():Rect {
        const cell = this.CurrentCell();
        return <Rect>{
            x: this.x,
            y: this.y,
            w: cell[0].length,
            h: cell.length,
        };
    }
    NextFrame() {
        this.iFrame++;
        this.iFrame = this.iFrame % this.cells.length;
    }
    CurrentCell():Cell {
        return this.cells[this.iFrame];
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
}

export {Sprite};
