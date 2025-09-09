import React from "react";
import { Chart } from "react-chartjs-2";

const LineChart = ({ data, options }) => {
  
  return <Chart type="line" data={data} options={options} />;
};

export default LineChart;
