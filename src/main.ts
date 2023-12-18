import { initGfx, setDrawables } from "./gfx.js";
import { Point, generatePoints } from "./data.js";
import { Neuron } from "./neuron.js";
import { ArtificialNeuralNetwork, Layer } from "./ann.js";
import { ActivationFunction } from "./util.js";

async function main() {
  initGfx();
  const points = generatePoints(500);
  setDrawables(points);


  const model = new ArtificialNeuralNetwork(2, 0.03, [
    new Layer(50, ActivationFunction.sigmoid),
    new Layer(50, ActivationFunction.sigmoid),
    // new Layer(3, ActivationFunction.sigmoid),
    new Layer(2, ActivationFunction.sigmoid),
  ]);

  const epochs = 10;
  for (let i = 0; i < epochs; i++) {
    console.log("Epoch: ", i);
    for (let i = 0; i < points.length; i++) {
      const inputVector = [points[i].x, points[i].y];
      // this is one hot encoding haha
      const targets = [0, 0];
      targets[points[i].label] = 1;

      model.fitOne(inputVector, targets);

      if (i % 25 == 0) {
        predAll(model, points);
      }
      await sleep(1);
    }
  }




}

function predAll(model: ArtificialNeuralNetwork, data: Point[]) {
  for (const pt of data) {
    const inputVector = [pt.x, pt.y];
    const prediction = model.predOne(inputVector);  // [0.1, 0.8]

    const actualPrediction = argMax(prediction);

    pt.guessed = (actualPrediction == pt.label);
  }
}

function argMax(elts: number[]): number {
  let maxIndex = 0;
  for (let i = 0; i < elts.length; i++) {
    if (elts[i] > elts[maxIndex]) {
      maxIndex = i;
    }
  }
  return maxIndex;
}


const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = main; //last line in the file, main function is initial