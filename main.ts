import {Sprite} from "./sprite.js";
import {Graph} from "./graph.js";
import {Scene, InvType} from "./scene.js";

const shipCell = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,4,0,0,0,0],
    [0,4,4,4,4,4,0,0],
    [4,4,4,4,4,4,4,0],
    [4,4,4,4,4,4,4,0],
];

const shipMissileCell = [
    [0,5,0],
    [0,5,0],
    [0,5,0],
    [0,5,0],
];

const invMissileCell = [
    [0,0,6,0],
    [0,6,0,0],
    [0,0,6,0],
    [0,6,0,0],
];

let graph:Graph;
let ship = new Sprite([shipCell], 1000);
let shipMissile = new Sprite([shipMissileCell], 1000);
let invMissile = new Sprite([invMissileCell], 1000);

invMissile.x = 25;
invMissile.y = 8;

ship.x = 10;
ship.y = 50;
shipMissile.x = 15;
shipMissile.y = 45;

let lastKey:string = "(none)";

function spXEdge(sp:Sprite):number {
    const rect = sp.Rect();
    return rect.x + rect.w - 1;
}

function main() {
    const cv = <HTMLCanvasElement>document.getElementById("canvas1");
    const ctx = <CanvasRenderingContext2D>cv.getContext("2d");

    graph = new Graph(cv, ctx, 4);
    const scene = new Scene(graph);

    scene.SetShip(ship);

    const pad = 10;
    let inv:Sprite;
    inv = scene.AddInv(InvType.A, 0,0);
    inv = scene.AddInv(InvType.A, spXEdge(inv)+pad, 0);
    inv = scene.AddInv(InvType.B, spXEdge(inv)+pad, 0);
    inv = scene.AddInv(InvType.C, spXEdge(inv)+pad, 0);
    inv = scene.AddInv(InvType.A, spXEdge(inv)+pad, 0);
    scene.AddInv(InvType.B, 0,20);

    const fps = 30;
    setInterval(function() {
        scene.Update();
        scene.Draw();
    }, 1000.0/fps);

    window.addEventListener("keyup", function(e:KeyboardEvent) {
        console.log(`keyup: ${e.key}`);
        lastKey = e.key;
    });
}

main();
