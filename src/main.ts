import { initGfx, setDrawables } from "./gfx.js";
import { Point, generatePoints } from "./data.js";
import { Neuron } from "./neuron.js";

async function main() {
  initGfx();
  const points = generatePoints(500);
  setDrawables(points);

  const model = new Neuron(2);

  for (const pt of points) {
    const inputVector = [pt.x, pt.y];
    model.fitOne(inputVector, pt.label);
    predAll(model, points);
    await sleep(100);
  }


}

function predAll(model: Neuron, data: Point[]) {
  for (const pt of data) {
    const inputVector = [pt.x, pt.y];
    const prediction = model.predOne(inputVector);
    pt.guessed = prediction == pt.label;
  }
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = main; //last line in the file, main function is initial