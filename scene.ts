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

import {Pos,Rect,Frame} from "./common";
import {Sprite,SprRect,SprAnimate,SprUpdate,SprAddAction,SprCheckCollision} from "./sprite.js";
import {Graph,GraphRect,GraphClear,GraphDrawSprite} from "./graph.js";
import {NewInv,NewShip,NewShipMissile} from "./gameobjects.js";
import {InvBlk,NewInvBlk,InvBlkMove,InvBlkBounds,InvBlkAddAction,InvBlkUpdate} from "./invblk.js";

interface Scene {
    g: Graph,
    invblk: InvBlk,
    ship: Sprite,
    invMs: Sprite[],
    shipMs: Sprite[],
    bgObjs: Sprite[],
    kbKey: string,
}

function NewScene(g:Graph):Scene {
    const invblk = NewInvBlk(3, 4, <Pos>{x:10, y:0});

    let dx = 5;
    let dy = 5;
    const gRect = GraphRect(g);
    InvBlkAddAction(invblk, "rowadvance",
        function(invblk:InvBlk, msElapsed:number):boolean {
            if (msElapsed >= 400) {
                InvBlkMove(invblk, invblk.pos.x + dx, invblk.pos.y);
                const [startPos, endPos] = InvBlkBounds(invblk);
                if (endPos.x >= gRect.w || startPos.x <= 0) {
                    dx = -dx;
                    InvBlkMove(invblk, invblk.pos.x + dx, invblk.pos.y + dy);
                }
                return true;
            }
            return false;
        });

    const scn = <Scene>{
        g: g,
        ship: NewShip(0,0),
        invblk: invblk,
        invMs: [],
        shipMs: [],
        bgObjs: [],
        kbKey: "",
    };


    // Garbage collect every 5 secs.
    setInterval(function() {
        ScnSweepObjects(scn);
    }, 5000);

    return scn;
}

function ScnAddInvaders(scn:Scene) {
    scn.invblk
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
    const key = ScnKbKey(scn);
    if (key != "") {
        switch(key) {
        case "ArrowLeft":
            scn.ship.x -= 1;
            break;
        case "ArrowRight":
            scn.ship.x += 1;
            break;
        case "ArrowUp":
        case " ":
            ScnFireShipMissile(scn);
            break;
        default:
            break;
        }
    }

    InvBlkUpdate(scn.invblk);

    for (const invRow of scn.invblk.Rows) {
        for (const inv of invRow) {
            if (inv == null) {
                continue;
            }
            SprAnimate(inv);
            SprUpdate(inv);
        }
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
        for (let y=0; y < scn.invblk.Rows.length; y++) {
            const invRow = scn.invblk.Rows[y];
            for (let x=0; x < invRow.length; x++) {
                const inv = invRow[x];
                if (inv == null || ms.Props["remove"] != null) {
                    continue;
                }
                if (SprCheckCollision(ms, inv)) {
                    console.log("Missile hit invader.");
                    ms.Props["remove"] = "y";
                    invRow[x] = null;
                    continue for_shipMs;
                }
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
}

function ScnDraw(scn:Scene) {
    const g = scn.g;

    GraphClear(g, 0);

    if (scn.ship != null) {
        GraphDrawSprite(g, scn.ship);
    }

    for (const invRow of scn.invblk.Rows) {
        for (const inv of invRow) {
            if (inv == null) {
                continue;
            }
            GraphDrawSprite(g, inv);
        }
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
        if (msElapsed >= 5) {
            if (sp.y > 0) {
                sp.y -= 2;
            }
            return true;
        }

        return false;
    });

    scn.shipMs.push(ms);
}

function ScnKbKey(scn:Scene):string {
    return scn.kbKey;
}

function ScnHandleKBEvent(scn:Scene, e:KeyboardEvent):boolean {
    if (e.type == "keydown") {
        scn.kbKey = e.key;
        return true;
    } else if (e.type == "keyup") {
        scn.kbKey = "";
        return true;
    }
    return false;
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

