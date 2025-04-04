import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import StatCard from '@/components/admin/Statistic/components/statCard'
import ComparisonCard from '@/components/admin/Statistic/components/comparisonCard'
import LineChart from '@/components/admin/Statistic/components/lineChart'
import BarChart from '@/components/admin/Statistic/components/barChart'
import ProgressCard from '@/components/admin/Statistic/components/progressCard'
import { Grid } from "@mui/material";

const Statistic = () => {

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Money" value="5.599.000" icon="💰" />
        <StatCard title="User" value="19" icon="👤" />
        <StatCard title="Product" value="289" icon="📦" />
        <StatCard title="Order" value="29" icon="📝" />
      </div>

      {/* Comparison & Charts */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{xs:12, md:6}}>
          <div className="h-full">
            <ComparisonCard />
          </div>
        </Grid>
        <Grid size={{xs:12, md:6}}>
          <div className="h-full">
            <LineChart />
          </div>
        </Grid>
      </Grid>
      {/* Column Chart & Progress */}
      <Grid container spacing={2} className='mt-4'>
        <Grid size={{xs:12, md:8}}>
          <BarChart />
        </Grid>
        <Grid size={{xs:12, md:4}}>
          <ProgressCard />
        </Grid>       
      </Grid>
    </div>
  );
};

export default Statistic;
