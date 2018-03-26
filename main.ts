import {Sprite} from "./sprite.js";
import {Graph} from "./graph.js";
import {Scene} from "./scene.js";

const shipCell = [
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00040000",
    "04444400",
    "44444440",
    "44444440",
];

const shipMissileCell = [
    "050",
    "050",
    "050",
    "050",
];

const invMissileCell = [
    "0060",
    "0600",
    "0060",
    "0600",
];

let graph:Graph;
let ship = new Sprite({"default": [shipCell]}, 1000);
let shipMissile = new Sprite({"default": [shipMissileCell]}, 1000);
let invMissile = new Sprite({"default": [invMissileCell]}, 1000);

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
    inv = scene.AddInv("C", 0,0);
    inv = scene.AddInv("A", spXEdge(inv)+pad, 0);
    inv = scene.AddInv("B", spXEdge(inv)+pad, 0);
    inv = scene.AddInv("B", spXEdge(inv)+pad, 0);
    inv = scene.AddInv("A", spXEdge(inv)+pad, 0);
    scene.AddInv("C", 0,20);

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
