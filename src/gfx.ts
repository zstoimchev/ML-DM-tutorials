const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const FRAME_TIME = 50;  //ms

let drawables: Drawable[] = []

export class Drawable {
  draw(ctx: CanvasRenderingContext2D, cw: number, ch: number) { }
}

export function setDrawables(dr: Drawable[]) {
  drawables = dr;
}

export function initGfx() {
  const canvas = getCanvas();
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  setInterval(draw, FRAME_TIME);
}

function draw() {
  //clear the screen first
  const ctx = getContext();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (const dr of drawables) {
    dr.draw(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function getCanvas(): HTMLCanvasElement {
  const canvas = document.getElementsByTagName("canvas")[0];
  if (!canvas) {
    throw new Error("cqannot find canvas");
  }
  return canvas;
}

function getContext(): CanvasRenderingContext2D {
  const context = getCanvas().getContext("2d");
  if (!context) {
    throw new Error("cannot get context");
  }
  return context;
}