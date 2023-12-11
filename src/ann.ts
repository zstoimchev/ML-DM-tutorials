import { Matrix, addMatrices, multiply, randomMatrix, transpose } from "./matrix.js";

export class Layer {
    private layerSize: number;
    private activationFunction: (m: Matrix) => Matrix;

    private weights: Matrix | undefined;
    private biases: Matrix | undefined;

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
        const mult = multiply(this.weights, input);
        const weightedSums = addMatrices(mult, this.biases);
        return this.activationFunction(weightedSums);
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
}