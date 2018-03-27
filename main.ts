import {Sprite} from "./sprite.js";
import {Graph} from "./graph.js";
import {Scene} from "./scene.js";

let graph:Graph;

function spXEdge(sp:Sprite):number {
    const rect = sp.Rect();
    return rect.x + rect.w - 1;
}

function main() {
    const cv = <HTMLCanvasElement>document.getElementById("canvas1");
    const ctx = <CanvasRenderingContext2D>cv.getContext("2d");

    graph = new Graph(cv, ctx, 4);
    const scene = new Scene(graph);

    scene.AddInvaders();
    scene.AddShip();

    const fps = 30;
    setInterval(function() {
        scene.Update();
        scene.Draw();
    }, 1000.0/fps);

    window.addEventListener("keydown", function(e:KeyboardEvent) {
        scene.HandleKBEvent(e);
    });
}

main();
