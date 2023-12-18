import { Matrix, addMatrices, multiply, multiplyByElement, multiplyScalar, randomMatrix, subtractMatrices, transpose } from "./matrix.js";
import { getDerivative } from "./util.js";

export class Layer {
    private layerSize: number;
    private activationFunction: (m: Matrix) => Matrix;

    private weights: Matrix | undefined;
    private biases: Matrix | undefined;

    private lastInput: Matrix | undefined;
    private lastOutput: Matrix | undefined;

    constructor(layerSize: number, acttivation: (m: Matrix) => Matrix) {
        this.layerSize = layerSize;
        this.activationFunction = acttivation;

    }

    public initWeights(inputSize: number): number {
        this.weights = randomMatrix(inputSize, this.layerSize);
        this.biases = randomMatrix(1, this.layerSize);
        return this.layerSize;
    }

    public feedForward(input: Matrix): Matrix {
        if (!this.weights || !this.biases) {
            throw new Error("Weights and biases not initialized!");
        }
        this.lastInput = input;

        const mult = multiply(this.weights, input);
        const weightedSums = addMatrices(mult, this.biases);

        this.lastOutput = weightedSums;

        return this.activationFunction(weightedSums);
    }

    public backPropagation(outErrors: Matrix, lr: number): Matrix {
        if (!this.weights || !this.biases) {
            throw new Error("Weights OR biases not initialized!");
        }
        if (!this.lastInput || !this.lastOutput) {
            throw new Error("Inputs OR outputs not initialized!");
        }
        // calculate the errors of the previous layer
        const transposedWeights = transpose(this.weights);
        const prevLayerErrors = multiply(transposedWeights, outErrors);

        // calculate the gradients
        const derivative = getDerivative(this.activationFunction);
        const outGradient = derivative(this.lastOutput);
        const gradient = multiplyByElement(outGradient, outErrors);

        // bias deltas/ changes
        const biasDeltas = multiplyScalar(gradient, lr);
        this.biases = addMatrices(this.biases, biasDeltas);

        // weight deltas/ changes
        const inputsTransposed = transpose(this.lastInput);
        const weightDeltas = multiply(biasDeltas, inputsTransposed);
        this.weights = addMatrices(this.weights, weightDeltas);

        return prevLayerErrors;
    }
}



export class ArtificialNeuralNetwork {
    private learningRate: number;
    private inputSize: number;
    private layers: Layer[];
    constructor(inputSize: number, learningRate: number, layers: Layer[]) {
        this.inputSize = inputSize;
        this.learningRate = learningRate;
        this.layers = layers;
        for (const layer of layers) {
            inputSize = layer.initWeights(inputSize);
        }
    }

    public predOne(inputs: number[]): number[] {
        let inputVector = transpose(new Matrix([inputs]));
        for (const layer of this.layers) {
            inputVector = layer.feedForward(inputVector);
        }
        return transpose(inputVector).getValues()[0];
    }

    public fitOne(inputs: number[], targets: number[]): void {
        const predictions = this.predOne(inputs);
        const predMatrix = new Matrix([predictions]);
        const targetMatrix = new Matrix([targets]);

        let errors = transpose(subtractMatrices(targetMatrix, predMatrix));

        for (let i = this.layers.length - 1; i >= 0; i--) {
            errors = this.layers[i].backPropagation(errors, this.learningRate);
        }
    }
}