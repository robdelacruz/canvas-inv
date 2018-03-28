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
    ship: Sprite;
    invMissiles: Sprite[];
    shipMissiles: Sprite[];

    dx: number;

    constructor(g:Graph) {
        this.g = g;
        this.invs = [];
        this.ship = newShip(0,0);
        this.invMissiles = [];
        this.shipMissiles = [];

        this.dx = +2;
    }
    SetShip(ship:Sprite) {
        this.ship = ship;
    }
    AddInv(invType:string, x:number, y:number): Sprite {
        const sp = this.newInv(invType, x,y);
        this.invs.push(sp);
        return sp;
    }
    AddInvMissile(ms:Sprite) {
        this.invMissiles.push(ms);
    }
    AddShipMissile(ms:Sprite) {
        this.shipMissiles.push(ms);
    }

    AddInvaders() {
        // Template invader sprite, for measurement purposes.
        const spTemplateInv = new Sprite(invFramesTable);
        const invRect = spTemplateInv.Rect();

        // Invader width and height
        const wInv = invRect.w;
        const hInv = invRect.h;

        // Invader horizontal and vertical margins
        const yInvMargin = hInv/3;
        const xInvMargin = wInv/4;
        const sideMargin = wInv*2;
        const topMargin = hInv;

        // Row measurements
        const graphRect = this.g.Rect();
        const wGraph = graphRect.w;
        const wRow = wGraph - (sideMargin*2);

        // Number of invaders per row
        const nInvRow = wRow / (wInv + xInvMargin);
        const nRows = 5;

//        console.log(`wGraph=${wGraph}, wRow=${wRow}, wInv=${wInv}, xInvMargin=${xInvMargin}, nInvRow=${nInvRow}`);

        let y = topMargin;
        let invType = "A"
        for (let i=0; i < nRows; i++) {
            let x = sideMargin;
            for (let j=0; j < nInvRow; j++) {
                this.AddInv(invType, x,y);
                x += wInv + xInvMargin;
            }
            y += hInv + yInvMargin;
            invType = invType=="A"? "B": invType=="B"? "C": "A";
        }

    }

    AddShip() {
        // Template ship sprite, for measurement purposes.
        const spTemplateShip = new Sprite(shipFramesTable);
        const shipRect = spTemplateShip.Rect();
        const wShip = shipRect.w;
        const hShip = shipRect.h;

        // Margins
        const bottomMargin = shipRect.h / 2;

        const graphRect = this.g.Rect();
        const hGraph = graphRect.h;
        const wGraph = graphRect.w;

        const xShip = wGraph/2 - wShip/2;
        const yShip = hGraph - bottomMargin - hShip;
        this.ship = newShip(xShip,yShip);
    }

    Update() {
        const invs = this.invs;
        const ship = this.ship;
        const shipMissiles = this.shipMissiles;

        for (const inv of invs) {
            inv.Animate();
            inv.Update();
        }

        if (ship != null) {
            ship.Animate();
            ship.Update();
        }

        for (const ms of shipMissiles) {
            ms.Animate();
            ms.Update();
        }
    }

    Draw() {
        const g = this.g;
        const invs = this.invs;
        const ship = this.ship;
        const shipMissiles = this.shipMissiles;

        g.Clear(0);

        if (ship != null) {
            g.DrawSprite(ship);
        }

        for (const inv of invs) {
            g.DrawSprite(inv);
        }

        for (const m of shipMissiles) {
            g.DrawSprite(m);
        }

    }

    FireShipMissile() {
        const spMissileTemplate = new Sprite(shipMissileFramesTable);
        const missileRect = spMissileTemplate.Rect();

        const ship = this.ship;
        const shipRect = ship.Rect();

        const xMissile = (shipRect.x + shipRect.w/2) - (missileRect.w/2);
        const yMissile = shipRect.y - missileRect.h;
        const missile = newShipMissile(xMissile,yMissile);

        this.shipMissiles.push(missile);
    }

    HandleKBEvent(e:KeyboardEvent):boolean {
        const ship = this.ship;

        //        console.log(e.key);

        switch(e.key) {
        case "ArrowLeft":
            ship.x -= 1;
            break;
        case "ArrowRight":
            ship.x += 1;
            break;
        case "ArrowUp":
        case " ":
            this.FireShipMissile();
            break;
        default:
            return false;
        }

        return true;
    }

    newInv(invType:string, x:number, y:number):Sprite {
        const self = this;

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

        return sp;
    }
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
const invFramesTable = {
    "default": invAFrames,
    "B": invBFrames,
    "C": invCFrames,
};

// Return random int from 0 to n-1.
function randInt(n:number):number {
    return Math.floor(Math.random() * n);
}

const shipFrames = <Frame[]>[
[
    "0004000",
    "0444440",
    "4444444",
    "4444444",
]];
const shipFramesTable = {
    "default": shipFrames,
};
function newShip(x:number, y:number):Sprite {
    const sp = new Sprite(shipFramesTable);
    sp.x = x;
    sp.y = y;
    return sp;
}

const shipMissileFrames = <Frame[]>[
[
    "050",
    "050",
    "050",
    "050",
]];
const shipMissileFramesTable = {
    "default": shipMissileFrames,
};
function newShipMissile(x:number, y:number):Sprite {
    const sp = new Sprite(shipMissileFramesTable);
    sp.x = x;
    sp.y = y;

    sp.AddAction("fire", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 10) {
            if (sp.y > 0) {
                sp.y -= 2;
            }
            return true;
        }

        return false;
    });

    return sp;
}

const invMissileCell = [
    "0060",
    "0600",
    "0060",
    "0600",
];


export {Scene};

