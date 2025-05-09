import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, options }) => {
  return <Bar key={JSON.stringify(data)} data={data} options={options} />;
};

export default BarChart;