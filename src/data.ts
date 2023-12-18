import { Drawable } from "./gfx";

export class Point implements Drawable {
  x: number;
  y: number;
  label: number;
  guessed: boolean;

  constructor(x: number, y: number, label: number) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.guessed = false;
  }

  draw(ctx: CanvasRenderingContext2D, cw: number, ch: number): void {
    const drawX = this.x * cw;
    const drawY = this.y * ch;

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(drawX, drawY, 10, 0, 2 * Math.PI);
    if (this.label == 1) {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }

    if (this.guessed) {
      ctx.fillStyle = "green";
    }
    else {
      ctx.fillStyle = "red";
    }
    ctx.beginPath();
    ctx.arc(drawX, drawY, 5, 0, 2 * Math.PI);
    ctx.fill();

  }
}

export function generatePoints(count: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random();
    const y = Math.random();
    let label = 1;
    if (x > y) {
      label = 0;
    }
    points.push(new Point(x, y, label));
  }

  return points;
}