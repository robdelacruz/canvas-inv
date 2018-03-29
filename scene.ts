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
import {Sprite,SprRect,SprAnimate,SprUpdate,SprAddAction,SprCheckCollisionMultiple} from "./sprite.js";
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
    return <Scene>{
        g: g,
        invs: [],
        ship: NewShip(0,0),
        invMs: [],
        shipMs: [],
        bgObjs: [],
    };
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
        SprAnimate(inv);
        SprUpdate(inv);
    }

    if (scn.ship != null) {
        SprAnimate(scn.ship);
        SprUpdate(scn.ship);
    }

    for (let i=0; i < scn.shipMs.length; i++) {
        const ms = scn.shipMs[i];
        SprAnimate(ms);
        SprUpdate(ms);

        if (SprCheckCollisionMultiple(ms, scn.invs)) {
            scn.shipMs.splice(i,1);
            i--;
        }
    }
}

function ScnDraw(scn:Scene) {
    const g = scn.g;

    GraphClear(g, 0);

    if (scn.ship != null) {
        GraphDrawSprite(g, scn.ship);
    }

    for (const inv of scn.invs) {
        GraphDrawSprite(g, inv);
    }

    for (const m of scn.shipMs) {
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
    const missile = NewShipMissile(xMissile,yMissile);
    scn.shipMs.push(missile);
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

