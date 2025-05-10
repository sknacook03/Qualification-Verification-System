import React from "react";
import { Chart } from "react-chartjs-2";

const PieChart = ({ data, options }) => {
  const chartKey = React.useMemo(() => JSON.stringify(data), [data]);

  return <Chart key={chartKey} type="bar" data={data} options={options} />;
};

export default PieChart;
