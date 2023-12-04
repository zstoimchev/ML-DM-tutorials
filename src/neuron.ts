export class Neuron {

  private learningRate: number = 0.05;
  private bias: number;
  private weights: number[];
  private activationFunction: (ws: number) => number;
  private loss: (pred: number, goal: number) => number;

  constructor(inputLength: number) {
    this.bias = Math.random() * 2 - 1;  //set the wiight to something between -1 and 1
    this.weights = [];
    for (let i = 0; i < inputLength; i++) {
      this.weights.push(Math.random() * 2 - 1);
    }
    this.activationFunction = ActivationFunction.sign;
    this.loss = LossFunction.absoluteError;
  }

  public predOne(input: number[]): number {
    const weightedSum = this.weightedSum(input);
    return this.activationFunction(weightedSum);
  }

  private weightedSum(input: number[]): number {
    let sum = 1 * this.bias;  //to add the bias at the end
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * this.weights[i];
    }
    return sum;
  }

  public fitOne(input: number[], label: number): number {
    const preddiction = this.predOne(input);
    const error = this.loss(preddiction, label);
    this.adjustWeights(input, error);   //we should make an optimizer like for loss and activation function but not for now
    return error;
  }

  private adjustWeights(input: number[], error: number): void {
    this.bias += (1 * error * this.learningRate);
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += (input[i] * error * this.learningRate);
    }
  }

}



export class ActivationFunction {
  static sign = (ws: number): number => {
    if (ws >= 0) {
      return 1;
    } else {
      return -1;
    }
  }
}
export class LossFunction {
  static absoluteError = (pred: number, goal: number): number => {
    return goal - pred;
  }
}