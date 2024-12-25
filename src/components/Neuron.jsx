import React from "react";

const Neuron = ({ x, y, activationValue, onClick }) => {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick}>
      <circle r={30} fill="#4caf50" />
      <text x={-10} y={5} fill="#fff" fontSize={12}>
        {activationValue.toFixed(2)}
      </text>
    </g>
  );
};

export default Neuron;
