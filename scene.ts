/*
Types
-----
Scene

Scene
-----
NewScene(g:Graph):Scene
ScnAddInvaders()
ScnAddShip()
ScnUpdate()
ScnDraw()
ScnFireShipMissile()
ScnHandleKBEvent(e:KeyboardEvent):boolean

*/

import {Frame} from "./common";
import {Sprite,SprRect,SprAnimate,SprUpdate,SprAddAction,SprCheckCollision} from "./sprite.js";
import {Graph,GraphRect,GraphClear,GraphDrawSprite} from "./graph.js";
import {NewInv,NewShip,NewShipMissile} from "./gameobjects.js";

interface Scene {
    g: Graph,
    invs: Sprite[],
    ship: Sprite,
    invMs: Sprite[],
    shipMs: Sprite[],
    bgObjs: Sprite[],
}

function NewScene(g:Graph):Scene {
    const scn = <Scene>{
        g: g,
        invs: [],
        ship: NewShip(0,0),
        invMs: [],
        shipMs: [],
        bgObjs: [],
    };

    // Garbage collect every 5 secs.
    setInterval(function() {
        ScnSweepObjects(scn);
    }, 5000);

    return scn;
}

function ScnAddInvaders(scn:Scene) {
    // Template invader sprite, for measurement purposes.
    const sprTemplateInv = NewInv("A", 0,0);
    const invRect = SprRect(sprTemplateInv);

    // Invader width and height
    const wInv = invRect.w;
    const hInv = invRect.h;

    // Invader horizontal and vertical margins
    const yInvMargin = hInv/3;
    const xInvMargin = wInv/4;
    const sideMargin = wInv*2;
    const topMargin = hInv;

    // Row measurements
    const graphRect = GraphRect(scn.g);
    const wGraph = graphRect.w;
    const wRow = wGraph - (sideMargin*2);

    // Number of invaders per row
    const nInvRow = wRow / (wInv + xInvMargin);
    const nRows = 5;

    let y = topMargin;
    let invType = "A"
    for (let i=0; i < nRows; i++) {
        let x = sideMargin;
        for (let j=0; j < nInvRow; j++) {
            scn.invs.push(NewInv(invType, x,y));
            x += wInv + xInvMargin;
        }
        y += hInv + yInvMargin;
        invType = invType=="A"? "B": invType=="B"? "C": "A";
    }
}

function ScnAddShip(scn:Scene) {
    // Template ship sprite, for measurement purposes.
    const sprTemplateShip = NewShip(0,0);
    const shipRect = SprRect(sprTemplateShip);
    const wShip = shipRect.w;
    const hShip = shipRect.h;

    // Margins
    const bottomMargin = shipRect.h / 2;

    const graphRect = GraphRect(scn.g);
    const hGraph = graphRect.h;
    const wGraph = graphRect.w;

    const xShip = wGraph/2 - wShip/2;
    const yShip = hGraph - bottomMargin - hShip;
    scn.ship = NewShip(xShip,yShip);
}

function ScnUpdate(scn:Scene) {
    for (const inv of scn.invs) {
        if (inv.Props["remove"] != null) {
            continue;
        }
        SprAnimate(inv);
        SprUpdate(inv);
    }

    if (scn.ship != null) {
        SprAnimate(scn.ship);
        SprUpdate(scn.ship);
    }

    for (const ms of scn.shipMs) {
        if (ms.Props["remove"] != null) {
            continue;
        }
        SprAnimate(ms);
        SprUpdate(ms);
    }

    // Check each ship missile hit on an invader.
for_shipMs:
    for (const ms of scn.shipMs) {
        for (const inv of scn.invs) {
            if (inv.Props["remove"] != null || ms.Props["remove"] != null) {
                continue;
            }
            if (SprCheckCollision(ms, inv)) {
                console.log("Missile hit invader.");
                ms.Props["remove"] = "y";
                inv.Props["remove"] = "y";
                continue for_shipMs;
            }
        }
    }
}

function ScnSweepObjects(scn:Scene) {
    // Clear out missiles marked for removal.
    let ncleared = 0;
    let aliveMs = [];
    for (const ms of scn.shipMs) {
        if (ms.Props["remove"] == null) {
            aliveMs.push(ms);
        } else {
            ncleared++;
        }
    }
    scn.shipMs = aliveMs;

    let ninvcleared = 0;
    let aliveInvs = [];
    for (const inv of scn.invs) {
        if (inv.Props["remove"] == null) {
            aliveInvs.push(inv);
        } else {
            ninvcleared++;
        }
    }
    scn.invs = aliveInvs;
    console.log(`ScnSweepObjects(): active missiles: ${scn.shipMs.length}, cleared missiles: ${ncleared}, active inv: ${scn.invs.length}, cleared invs: ${ninvcleared}`);
}

function ScnDraw(scn:Scene) {
    const g = scn.g;

    GraphClear(g, 0);

    if (scn.ship != null) {
        GraphDrawSprite(g, scn.ship);
    }

    for (const inv of scn.invs) {
        if (inv.Props["remove"] != null) {
            continue;
        }
        GraphDrawSprite(g, inv);
    }

    for (const m of scn.shipMs) {
        if (m.Props["remove"] != null) {
            continue;
        }
        GraphDrawSprite(g, m);
    }
}

function ScnFireShipMissile(scn:Scene) {
    const sprMissileTemplate = NewShipMissile(0,0);
    const missileRect = SprRect(sprMissileTemplate);

    const ship = scn.ship;
    const shipRect = SprRect(ship);

    const xMissile = (shipRect.x + shipRect.w/2) - (missileRect.w/2);
    const yMissile = shipRect.y - missileRect.h;
    const ms = NewShipMissile(xMissile,yMissile);

    SprAddAction(ms, "fire", function(sp:Sprite, msElapsed:number):boolean {
        if (msElapsed >= 10) {
            if (sp.y > 0) {
                sp.y -= 2;
            }
            return true;
        }

        return false;
    });

    scn.shipMs.push(ms);
}

function ScnHandleKBEvent(scn:Scene, e:KeyboardEvent):boolean {
    const ship = scn.ship;

    switch(e.key) {
    case "ArrowLeft":
        ship.x -= 1;
        break;
    case "ArrowRight":
        ship.x += 1;
        break;
    case "ArrowUp":
    case " ":
        ScnFireShipMissile(scn);
        break;
    default:
        return false;
    }

    return true;
}

export {
    Scene,
    NewScene,
    ScnAddInvaders,
    ScnAddShip,
    ScnUpdate,
    ScnDraw,
    ScnFireShipMissile,
    ScnHandleKBEvent,
};

