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

import {Frame} from "./common";
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

const invAFrames = <Frame[]>[
[
    "00100000100",
    "00010001000",
    "00111111100",
    "01101110110",
    "11111111111",
    "10111111101",
    "10100000101",
    "00011011000",
], [
    "00100000100",
    "10010001001",
    "10111111101",
    "11101110111",
    "11111111111",
    "01111111100",
    "00100000100",
    "01000000010",
]];

const invBFrames = <Frame[]>[
[
    "000022220000",
    "022222222220",
    "222222222222",
    "222002200222",
    "222222222222",
    "002220022200",
    "022002200220",
    "002200002200",
], [
    "000022220000",
    "022222222220",
    "222222222222",
    "222002200222",
    "222222222222",
    "000220022000",
    "002202202200",
    "220000000022",
]];

const invCFrames = <Frame[]>[
[
    "00033000",
    "00333300",
    "03333330",
    "33033033",
    "33333333",
    "03033030",
    "30000003",
    "03000030",
], [
    "00033000",
    "00333300",
    "03333330",
    "33033033",
    "33333333",
    "00300300",
    "03033030",
    "30300303",
]];

const invFramesTable = {
    "default": invAFrames,
    "B": invBFrames,
    "C": invCFrames,
};

// Return random int from 0 to n-1.
function randInt(n:number):number {
    return Math.floor(Math.random() * n);
}

function newInv(invType:string, x:number, y:number):Sprite {
    const sp = new Sprite(invFramesTable);
    if (invType == "A") {
        sp.SelectActiveFrames("A");
        sp.MsPerFrame = 800;
    } else if (invType == "B") {
        sp.SelectActiveFrames("B");
        sp.MsPerFrame = 500;
    } else {
        sp.SelectActiveFrames("C");
        sp.MsPerFrame = 200;
    }
    sp.x = x;
    sp.y = y;

    const diveProbability = randInt(100);
    if (diveProbability > 50) {
        sp.AddAction("dive", function(sp:Sprite, msElapsed:number):boolean {
            if (msElapsed >= 100) {
                sp.y += 4;

                const swingRange = 15
                const dx = (randInt(swingRange)+1) - (swingRange/2);
                sp.x += dx;

                return true;
            }
            return false;
        });

        return sp;
    }

    sp.AddAction("horz", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 300) {
            sp.x += 2;
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

