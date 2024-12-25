export const forwardPropagation = (input, weights) => {
  return input.map((x, i) => x * weights[i]).reduce((a, b) => a + b, 0);
};

export const backwardPropagation = (error, weights, learningRate) => {
  return weights.map((w) => w - learningRate * error);
};
