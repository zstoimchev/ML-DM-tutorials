import { initGfx, setDrawables } from "./gfx.js";
import { Point, generateCircularPoints, generatePoints } from "./data.js";
import { Neuron } from "./neuron.js";
import { ArtificialNeuralNetwork, Layer } from "./ann.js";
import { ActivationFunction } from "./util.js";
import { getDataset } from "./mnist_handwritten.js";

type MnistDigit = {
  image: number[],
  label: number
}

async function main() {
  initGfx();

  console.log("loading dataset");
  const dataset = getDataset() as MnistDigit[];
  const [train, test] = splitDataset(dataset);
  console.log(train.length);
  const model = new ArtificialNeuralNetwork(784, 0.03, [
    new Layer(256, ActivationFunction.sigmoid),
    new Layer(128, ActivationFunction.sigmoid),
    new Layer(2, ActivationFunction.sigmoid),
  ]);

  testModel(model, test);

  const epochs = 1;
  
  for (let i = 0; i < epochs; i++) {
    console.log("Epoch: ", i);

    for (const digit of train) {
      const output = [0,0];
      output[digit.label] = 1;
      // 0 -> [1, 0]
      //  1 -> [0, 1]

      model.fitOne(digit.image, output);
    }
  }

  testModel(model, test);
  // model.save("model.json");
}

function splitDataset(dataset: MnistDigit[]): [MnistDigit[], MnistDigit[]] {
  //shuffle
  const shuffled = dataset.sort(() => 0.5 - Math.random());
  const splitPoint = Math.floor(shuffled.length * 0.8);

  const train = shuffled.slice(0, splitPoint);
  const test = shuffled.slice(splitPoint);
  return [train, test];
}

function testModel(model: ArtificialNeuralNetwork, data: MnistDigit[]){
  console.log("testing on " + data.length + " datapoints");
  console.time("testing");

  let correct = 0;
  const confusionMatrix = [
    [0,0],
    [0,0]
  ]
  console.log(data)
  for( const digit of data){
    const pred = model.predOne(digit.image);
    if (argMax(pred) == digit.label){
      correct++;
    }
    confusionMatrix[digit.label][argMax(pred)]++;
  }
  console.timeEnd("testing"); 

  const accuracy = Math.round(correct / data.length * 100);
  console.log("accuracy: " + accuracy + "%");
  console.table(confusionMatrix);
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




// perfect confusion matrix is diagonal one
