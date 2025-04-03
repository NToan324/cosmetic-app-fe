import { Grid, Box, LinearProgress } from "@mui/material";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
const Dashboard = () => {
  return (
<<<<<<< HEAD
    <div className=''>
      <Greeting />
    </div>
  )
}

export default Dashboard
=======
    <div className="p-4 pt-8">
      <Grid container spacing={3}>
        {/* Biểu đồ bên trái */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="bg-white p-4 rounded-lg shadow-lg h-full">
            <p className="font-bold">
              Overview
            </p>
            <p className="text-red-500 font-semibold">
              -99% from 2019
            </p>
            <div className="mt-4">
              {/* Giả sử đây là biểu đồ (thay bằng thư viện Chart.js hoặc tương tự) */}
              <img src="/your-chart-image.png" alt="Chart" className="w-full" />
            </div>
          </Box>
        </Grid>

        {/* 4 ô bên phải */}
        <Grid container size={{ xs: 12, md: 6 }} spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-green-500 text-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between">
                <p className="text-sm">TODAY'S MONEY</p>
                <FaMoneyBillWaveAlt />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">99000</p>
              </div>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <p className="text-sm">TODAY'S USER</p>
                <FaUser />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">10</p>
              </div>
              
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between">
                <p className="text-sm">TODAY'S PRODUCT</p>
                <FaBox />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">489</p>
              </div>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-orange-400 text-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between">
                <p className="text-sm">TODAY'S INVOICE</p>
                < FaFileInvoice />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">289</p>
              </div>
            </Box>
          </Grid>

          {/* Thanh tiến trình */}
          <Grid size={{ xs: 12 }}>
            <Box className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-red-500 font-bold">Daily Progress</p>
              <p className="text-2xl font-bold">48%</p>
              <LinearProgress
                variant="determinate"
                value={48}
                className="h-2 rounded-md"
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "green",
                  },
                }}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>0</span>
                <span>39.169.000</span>
                <span>100.000.000</span>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
>>>>>>> main
