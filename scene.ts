/*
Functions
-------
newInv(invType:string, x:number, y:number):Sprite

Enums
-----
InvType

Scene
-----
new(g:Graph)
SetShip(ship:Sprite)
AddInv(invType:string):Inv
AddInvMissile(ms:Sprite)
AddShipMissile(ms:Sprite)
Update()
Draw()

*/

import {Frame, FrameSeq} from "./common";
import {Sprite} from "./sprite.js";
import {Graph} from "./graph";

class Scene {
    g:Graph;
    invs: Sprite[];
    ship: Sprite | null;
    invMissiles: Sprite[];
    shipMissiles: Sprite[];

    constructor(g:Graph) {
        this.g = g;
        this.invs = [];
        this.ship = null;
        this.invMissiles = [];
        this.shipMissiles = [];
    }
    SetShip(ship:Sprite) {
        this.ship = ship;
    }
    AddInv(invType:string, x:number, y:number): Sprite {
        const sp = newInv(invType, x,y);
        this.invs.push(sp);
        return sp;
    }
    AddInvMissile(ms:Sprite) {
        this.invMissiles.push(ms);
    }
    AddShipMissile(ms:Sprite) {
        this.shipMissiles.push(ms);
    }

    Update() {
        const invs = this.invs;
        const ship = this.ship;

        for (const inv of invs) {
            inv.Animate();
            inv.Update();
        }

        if (ship != null) {
            ship.Animate();
            ship.Update();
        }
    }

    Draw() {
        const g = this.g;
        const invs = this.invs;
        const ship = this.ship;

        g.Clear(0);

        for (const inv of invs) {
            g.DrawSprite(inv);
        }

        if (ship != null) {
            g.DrawSprite(ship);
        }
    }
}

const invAFrameSeq = <FrameSeq>[
[
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [0,0,0,1,1,0,1,1,0,0,0],
],
[
    [0,0,1,0,0,0,0,0,1,0,0],
    [1,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,0,1,0],
]];

const invBFrameSeq = <FrameSeq>[
[
    [0,0,0,0,2,2,2,2,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,0],
    [2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,0,0,2,2,0,0,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2],
    [0,0,2,2,2,0,0,2,2,2,0,0],
    [0,2,2,0,0,2,2,0,0,2,2,0],
    [0,0,2,2,0,0,0,0,2,2,0,0],
], [
    [0,0,0,0,2,2,2,2,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,0],
    [2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,0,0,2,2,0,0,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2],
    [0,0,0,2,2,0,0,2,2,0,0,0],
    [0,0,2,2,0,2,2,0,2,2,0,0],
    [2,2,0,0,0,0,0,0,0,0,2,2],
]];

const invCFrameSeq = <FrameSeq>[
[
    [0,0,0,3,3,0,0,0],
    [0,0,3,3,3,3,0,0],
    [0,3,3,3,3,3,3,0],
    [3,3,0,3,3,0,3,3],
    [3,3,3,3,3,3,3,3],
    [0,3,0,3,3,0,3,0],
    [3,0,0,0,0,0,0,3],
    [0,3,0,0,0,0,3,0],
], [
    [0,0,0,3,3,0,0,0],
    [0,0,3,3,3,3,0,0],
    [0,3,3,3,3,3,3,0],
    [3,3,0,3,3,0,3,3],
    [3,3,3,3,3,3,3,3],
    [0,0,3,0,0,3,0,0],
    [0,3,0,3,3,0,3,0],
    [3,0,3,0,0,3,0,3],
]];

const invFrameSeqs = {
    "default": invAFrameSeq,
    "B": invBFrameSeq,
    "C": invCFrameSeq,
};

function newInv(invType:string, x:number, y:number):Sprite {
    const sp = new Sprite(invFrameSeqs);
    sp.MsPerFrame = 200;
    sp.x = x;
    sp.y = y;

    sp.AddAction("horz", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 300) {
            sp.x += 2;
            return true;
        }
        return false;
    });

    sp.AddAction("vert", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 1500) {
            let yinc = 0;
            if (invType == "B") {
                sp.SelectFrameSeq("B");
                yinc = 3;
            } else if (invType == "C") {
                sp.SelectFrameSeq("C");
                yinc = 1;
            }
            sp.y += yinc;

            sp.MsPerFrame = 200;
            return true;
        }
        return false;
    });

    /*
    sp.AddAction("animate", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 400) {
            sp.NextFrame();
            return true;
        }
        return false;
    });
     */

    return sp;
}

export {Scene};

