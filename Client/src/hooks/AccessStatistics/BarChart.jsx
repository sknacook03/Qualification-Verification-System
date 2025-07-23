import React from "react";
import { Chart } from "react-chartjs-2";

const BarChart = ({ data, options}) => {


  return <Chart  type="bar" data={data} options={options}  />;
};

export default BarChart;
