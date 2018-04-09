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
import {Graph,GraphRect,GraphClear,GraphDrawSprite,GraphDrawText} from "./graph.js";
import {NewInv,NewShip,NewShipMissile,NewInvMissile,NewInvDebris,NewShipDebris,NewMissileDebris} from "./gameobjects.js";
import {InvBlk,NewInvBlk,InvBlkMove,InvBlkBounds,InvBlkExposed} from "./invblk.js";
import {ActionsTbl,ActionCB,NewActionsTbl,ActionsTblAddAction,ActionsTblUpdate} from "./actionstbl.js";

interface Scene {
    g: Graph,
    invblk: InvBlk,
    ship: Sprite,
    invMs: (Sprite|null)[],
    shipMs: (Sprite|null)[],
    bgObjs: Sprite[],
    kbKeys: {[key:string]:boolean},
    actionsTbl:ActionsTbl,
}

// Return random int from 0 to n-1.
function randInt(n:number):number {
    return Math.floor(Math.random() * n);
}

function NewScene(g:Graph):Scene {
    const invblk = NewInvBlk(5, 7, <Pos>{x:10, y:0});

    const scn = <Scene>{
        g: g,
        ship: NewShip(0,0),
        invblk: invblk,
        invMs: [],
        shipMs: [],
        bgObjs: [],
        kbKeys: {},
        actionsTbl: NewActionsTbl(),
    };

    let dx = 5;
    let dy = 5;
    const gRect = GraphRect(g);
    ActionsTblAddAction(scn.actionsTbl, "inv_rowadvance",
        function(msElapsed:number):boolean {
            if (msElapsed >= 200) {
                InvBlkMove(invblk, invblk.pos.x + dx, invblk.pos.y);
                const [startPos, endPos] = InvBlkBounds(invblk);
                if (endPos.x >= gRect.w-5 || startPos.x <= 0) {
                    dx = -dx;
                    InvBlkMove(invblk, invblk.pos.x + dx, invblk.pos.y + dy);
                }
                return true;
            }
            return false;
        });

    ActionsTblAddAction(scn.actionsTbl, "inv_fire",
        function(msElapsed:number):boolean {
            if (msElapsed >= 500) {
                const exposedInvs = InvBlkExposed(scn.invblk);
                if (exposedInvs.length == 0) {
                    return true;
                }
                const iInv = randInt(exposedInvs.length);
                ScnFireInvMissile(scn, exposedInvs[iInv]);
                return true;
            }
            return false;
        });

    // Garbage collect every 5 secs.
    setInterval(function() {
        ScnSweepObjects(scn);
    }, 5000);

    return scn;
}

function ScnAddInvaders(scn:Scene) {
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
    const keys = ScnKbKeys(scn);
    for (const key of keys) {
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

            // Simulate a 'keyup' event after every missile fired.
            // Need to press fire key once on every firing missile.
            delete scn.kbKeys[key];
            break;
        default:
            break;
        }
    }

    ActionsTblUpdate(scn.actionsTbl);

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
        if (ms == null) {
            continue;
        }
        SprAnimate(ms);
        SprUpdate(ms);
    }

    for (const ms of scn.invMs) {
        if (ms == null) {
            continue;
        }
        SprAnimate(ms);
        SprUpdate(ms);
    }

    for (const bg of scn.bgObjs) {
        if (bg == null) {
            continue;
        }
        SprAnimate(bg);
        SprUpdate(bg);
    }

    scanInvHit(scn);
    scanShipHit(scn);
    scanMsHit(scn);

}

function scanInvHit(scn:Scene) {
    // Check each ship missile hit on an invader.
for_shipMs:
    for (let iMs=0; iMs < scn.shipMs.length; iMs++) {
        const ms = scn.shipMs[iMs];
        if (ms == null) {
            continue;
        }
        for (let y=0; y < scn.invblk.Rows.length; y++) {
            const invRow = scn.invblk.Rows[y];
            for (let x=0; x < invRow.length; x++) {
                const inv = invRow[x];
                if (inv == null) {
                    continue;
                }

                // Collision: remove missile and inv.
                if (SprCheckCollision(ms, inv)) {
                    scn.shipMs[iMs] = null;
                    invRow[x] = null;

                    invHit(scn, inv);

                    continue for_shipMs;
                }
            }
        }
    }
}
function scanShipHit(scn:Scene) {
}
function scanMsHit(scn:Scene) {
}

function invHit(scn:Scene, inv:Sprite) {
    // Add new 'invader debris' sprite to background objects
    const debris = NewInvDebris(inv.x, inv.y);
    scn.bgObjs.push(debris);
}

function shipHit(scn:Scene) {
    // Add new 'ship debris' sprite to background objects
    const debris = NewShipDebris(scn.ship.x, scn.ship.y);
    scn.bgObjs.push(debris);
}

function missileCollide(scn:Scene, shipMs:Sprite, invMs:Sprite) {
    // Add new 'missile debris' sprite to background objects
    const debris = NewMissileDebris(shipMs.x, shipMs.y);
    scn.bgObjs.push(debris);
}

function ScnSweepObjects(scn:Scene) {
    // Clear out missiles marked for removal.
    let aliveMs = [];
    for (const ms of scn.shipMs) {
        if (ms != null) {
            aliveMs.push(ms);
        }
    }
    scn.shipMs = aliveMs;

    let invAliveMs = [];
    for (const ms of scn.invMs) {
        if (ms != null) {
            invAliveMs.push(ms);
        }
    }
    scn.invMs = invAliveMs;
}

function ScnDraw(scn:Scene) {
    const g = scn.g;

    GraphClear(g, 0);

    for (const bg of scn.bgObjs) {
        if (bg == null) {
            continue;
        }
        GraphDrawSprite(g, bg);
    }

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
        if (m == null) {
            continue;
        }
        GraphDrawSprite(g, m);
    }

    for (const m of scn.invMs) {
        if (m == null) {
            continue;
        }
        GraphDrawSprite(g, m);
    }

//    GraphDrawText(g, 5, 80, `Ships:3  Invaders:20  Score:12`, 0, 5);
}

function ScnFireShipMissile(scn:Scene) {
    const sprMsTempl = NewShipMissile(0,0);
    const msRect = SprRect(sprMsTempl);

    const shipRect = SprRect(scn.ship);
    const xMs = (shipRect.x + shipRect.w/2) - (msRect.w/2);
    const yMs = shipRect.y - msRect.h;
    const ms = NewShipMissile(xMs,yMs);

    SprAddAction(ms, "fire", function(msElapsed:number):boolean {
        if (msElapsed >= 5) {
            if (ms.y > 0) {
                ms.y -= 2;
            }

            // If reached top edge, remove missile from screen
            if (ms.y <= 0) {
                for (let i=0; i < scn.shipMs.length; i++) {
                    if (scn.shipMs[i] == ms) {
                        scn.shipMs[i] = null;
                        break;
                    }
                }
            }
            return true;
        }
        return false;
    });

    scn.shipMs.push(ms);
}

function ScnFireInvMissile(scn:Scene, inv:Sprite) {
    const gRect = GraphRect(scn.g);
    const sprMsTempl = NewInvMissile(0,0);
    const msRect = SprRect(sprMsTempl);
    const invRect = SprRect(inv);
    const xMs = (invRect.x + invRect.w/2) - (msRect.w/2);
    const yMs = invRect.y + invRect.h;
    const ms = NewInvMissile(xMs,yMs);

    SprAddAction(ms, "fire", function(msElapsed:number):boolean {
        if (msElapsed >= 10) {
            if (ms.y < gRect.h) {
                ms.y += 2;
            }

            // If reached bottom edge, remove missile from screen
            if (ms.y >= gRect.h) {
                for (let i=0; i < scn.invMs.length; i++) {
                    if (scn.invMs[i] == ms) {
                        scn.invMs[i] = null;
                        break;
                    }
                }
            }
            return true;
        }
        return false;
    });

    scn.invMs.push(ms);
}

function ScnKbKeys(scn:Scene):string[] {
    return Object.keys(scn.kbKeys);
}

function ScnHandleKBEvent(scn:Scene, e:KeyboardEvent):boolean {
    if (e.type == "keydown") {
        scn.kbKeys[e.key] = true;
        return true;
    } else if (e.type == "keyup") {
        delete scn.kbKeys[e.key];
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

