import React from "react";

const Connection = ({ x1, y1, x2, y2, gradient }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#f44336"
      strokeWidth={2}
      markerEnd="url(#arrow)"
    />
  );
};

export default Connection;
