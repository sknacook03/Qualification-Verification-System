import React from "react";
import { Chart } from "react-chartjs-2";

const LineChart = ({ data, options }) => {
  const chartKey = React.useMemo(() => JSON.stringify(data), [data]);

  return <Chart key={chartKey} type="line" data={data} options={options} />;
};

export default LineChart;
