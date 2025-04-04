import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const chartSetting = {
  yAxis: [
    {
      label: 'Revenue 2025',
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const dataset = [
  { month: 'Jan', producta: 400, productb: 300, productc: 500, productd: 200 },
  { month: 'Feb', producta: 450, productb: 350, productc: 550, productd: 250 },
  { month: 'Mar', producta: 470, productb: 370, productc: 600, productd: 300 },
  { month: 'Apr', producta: 500, productb: 390, productc: 650, productd: 320 },
];

const valueFormatter = (value: number | null) => {
    if (value == null) return 'N/A';
    return `$${value.toLocaleString()}`;
  };
  

export default function BarsDataset() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'producta', label: 'Product A', valueFormatter },
        { dataKey: 'productb', label: 'Product B', valueFormatter },
        { dataKey: 'productc', label: 'Product C', valueFormatter },
        { dataKey: 'productd', label: 'Product D', valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}
