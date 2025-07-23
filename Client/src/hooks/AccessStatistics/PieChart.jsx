import React from "react";
import { Chart } from "react-chartjs-2";

const PieChart = ({ data, options }) => {


  return <Chart type="pie" data={data} options={options} />;
};

export default PieChart;
