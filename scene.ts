/*
Functions
-------
newInv(type:InvType, x:number, y:number):Sprite

Enums
-----
InvType

Scene
-----
new(g:Graph)
SetShip(ship:Sprite)
AddInv(type:InvType):Inv
AddInvMissile(ms:Sprite)
AddShipMissile(ms:Sprite)
Update()
Draw()

*/

import {Cell} from "./common";
import {Sprite} from "./sprite.js";
import {Graph} from "./graph";

enum InvType {A, B, C}

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
    AddInv(type:InvType, x:number, y:number): Sprite {
        const sp = newInv(type, x,y);
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
//            ship.x += 2;
            ship.Animate();
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

const invACells = <Cell[]>[
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

const invBCells = <Cell[]>[
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

const invCCells = <Cell[]>[
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

function newInv(type:InvType, x:number, y:number):Sprite {
    let invCells:Cell[];
    if (type == InvType.A) {
        invCells = invACells;
    } else if (type == InvType.B) {
        invCells = invBCells;
    } else {
        invCells = invCCells;
    }

    const sp = new Sprite(invCells);
    sp.x = x;
    sp.y = y;

    sp.AddAction("horz", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 300) {
            sp.x += 1;
            return true;
        }
        return false;
    });

    sp.AddAction("vert", function(sp:Sprite, msElapsed:number):boolean {
        let yinc = 0;
        if (type == InvType.A || type == InvType.C) {
            yinc = 5;
        } else {
            yinc = 2;
        }
        if (msElapsed >= 2000) {
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

export {Scene, InvType};

