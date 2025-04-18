// src/components/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Pagination
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import orderService, { OrderHistory } from '@/services/order.service';
import customerService, { Customer } from '@/services/customer.service';
import { formatCurrency, formatDate } from '@/helpers';
import DialogViewHistory from '@/components/admin/Invoice/components/dialog';
import {
  FaMoneyBillWaveAlt,
  FaUser,
  FaBox,
  FaFileInvoice
} from 'react-icons/fa';

interface LineDataPoint {
  date: string;
  revenueValue: number;
}

const TARGET = 100_000_000;

const Dashboard: React.FC = () => {
  const [lineData, setLineData] = useState<LineDataPoint[]>([]);
  const [todayOrders, setTodayOrders] = useState<number>(0);
  const [todayProducts, setTodayProducts] = useState<number>(0);
  const [todayRevenue, setTodayRevenue] = useState<number>(0);
  const [todayNewCustomers, setTodayNewCustomers] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailedOrders, setDetailedOrders] = useState<OrderHistory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const openDialog = (order: OrderHistory) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  }

  const accessToken = localStorage.getItem('accessToken') || '';

  // 1) Fetch orders & build lineData + today's stats
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // lấy tất cả orders trong vòng 7 ngày qua (page=1, limit=1000 cho chắc)
        const res = await orderService.getOrderHistory(accessToken, 1, 1000);
        const orders: OrderHistory[] = res.data.data;

        // chuẩn bị 7 ngày (bao gồm hôm nay)
        const today = dayjs().startOf('day');
        const days: Dayjs[] = [];
        for (let i = 6; i >= 0; i--) {
          days.push(today.subtract(i, 'day'));
        }

        // khởi map date-> revenue cho Completed
        const revMap: Record<string, number> = {};
        days.forEach(d => {
          revMap[d.format('YYYY-MM-DD')] = 0;
        });

        // filtre completed orders
        const completed = orders.filter(o => o.status === 'Completed');

        // tính doanh thu theo ngày và stats hôm nay
        let ordersToday = 0, productsToday = 0, revenueToday = 0;
        completed.forEach(o => {
          const d = dayjs(o.createdAt).format('YYYY-MM-DD');
          if (d in revMap) {
            revMap[d] += o.totalPrice;
          }
          if (d === today.format('YYYY-MM-DD')) {
            ordersToday++;
            productsToday += o.items.reduce((s, i) => s + i.quantity, 0);
            revenueToday += o.totalPrice;
          }
        });

        // build lineData
        const ld = days.map(d => ({
          date: d.format('YYYY-MM-DD'),
          revenueValue: revMap[d.format('YYYY-MM-DD')]
        }));
        setLineData(ld);

        setTodayOrders(ordersToday);
        setTodayProducts(productsToday);
        setTodayRevenue(revenueToday);

        // progress %
        setProgress(Math.min(100, Math.round((revenueToday / TARGET) * 100)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [accessToken]);

  // 2) Fetch customers để tính mới hôm nay
  useEffect(() => {
    const fetchCust = async () => {
      try {
        const res = await customerService.getCustomers(accessToken, 1, 1000);
        const customers: Customer[] = res.data.data;
        const today = dayjs().format('YYYY-MM-DD');
        const newCust = customers.filter(c =>
          dayjs(c.createdAt).format('YYYY-MM-DD') === today
        ).length;
        setTodayNewCustomers(newCust);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCust();
  }, [accessToken]);

  // 3) xử lý click vào dot trên line chart
const handleChartClick = (e: any) => {
  const date = e.activeLabel as string;
  if (!date) return;

  setSelectedDate(date);
  setDetailedOrders([]);

  orderService.getOrderHistory(accessToken, 1, 1000)
    .then(res => {
      const all = res.data.data.filter(o =>
        dayjs(o.createdAt).format('YYYY-MM-DD') === date
      );
      setDetailedOrders(all);
    })
    .catch(console.error);
};
const paginatedOrders = detailedOrders.slice((page - 1) * limit, page * limit);
const totalPages = Math.ceil(detailedOrders.length / limit);

  return (
    <div className="p-4 pt-8">
      <Grid container spacing={3}>
        {/* Left: line chart */}
        <Grid size={{xs:12, md:6}}>
          <Box className="bg-white p-4 rounded-lg shadow-lg h-full">
            <Typography fontWeight="bold" className='text-gray-600'>Doanh thu 7 ngày qua</Typography>
            <Box className="mt-4" style={{ height: 300 }}>
              {loading
                ? <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineData}
                      onClick={handleChartClick}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(v: number) =>
                        v.toLocaleString()
                      } />
                      <Line
                        type="monotone"
                        dataKey="revenueValue"
                        stroke="#8884d8"
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )
              }
            </Box>
          </Box>
        </Grid>

        {/* Right: 4 stats + progress */}
        <Grid container size={{xs:12, md:6}} spacing={2}>
          <Grid size={{xs:12, md:6}}>
            <Box className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <p className="text-sm">TODAY'S MONEY</p>
                <FaMoneyBillWaveAlt />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">
                  {todayRevenue.toLocaleString()}
                </p>
              </div>
            </Box>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Box className="bg-orange-400 text-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <p className="text-sm">TODAY'S INVOICE</p>
                <FaFileInvoice />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">
                  {todayOrders}
                </p>
              </div>
            </Box>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Box className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <p className="text-sm">TODAY'S PRODUCT</p>
                <FaBox />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">
                  {todayProducts}
                </p>
              </div>
            </Box>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Box className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <p className="text-sm">TODAY'S CUSTOMER</p>
                <FaUser />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">
                  {todayNewCustomers}
                </p>
              </div>
            </Box>
          </Grid>

          <Grid size={{xs:12}}>
            <Box className="bg-white p-4 rounded-lg shadow-md h-full">
              <Typography className="text-red-500 font-bold">Daily Progress</Typography>
              <Typography className="text-2xl font-bold">{progress}%</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                className="h-2 rounded-md"
                sx={{
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: progress > 80 ? 'green' : 'orange'
                  }
                }}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>0</span>
                <span>{todayRevenue.toLocaleString()}</span>
                <span>{TARGET.toLocaleString()}</span>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <div className='border-t border-gray-300 w-full my-8'></div>
      {selectedDate && (
        <Box mt={4}>
          <Typography variant="h6">Chi tiết cho ngày {selectedDate}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="detailed orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Số thứ tự</TableCell>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>Ngày đặt hàng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, idx) => (
                    <TableRow
                      key={order.orderId}
                      hover
                      onClick={() => openDialog(order)}
                      className="hover:bg-amber-50"
                    >
                      <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Box
                        className={`max-w-[100px] py-2 px-4 rounded-xl text-center ${
                                                  order.status.toUpperCase() === "CANCELED"
                                                    ? 'bg-red text-red'
                                                    : 'bg-green text-green'
                                                }`}
                        >
                            {order.status}
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={(_, v) => setPage(v)}
            />
          </Stack>
        </Box>
      )}

      {/* Dialog chi tiết khi click */}
      <DialogViewHistory
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        customerName={selectedOrder?.customerName || ''}
        phoneNumber={selectedOrder?.phoneNumber || ''}
        orderId={selectedOrder?.orderId || ''}
        paymentMethod={selectedOrder?.payment_method || ''}
        orderDate={selectedOrder?.createdAt || ''}
        employeeName={selectedOrder?.createdBy || ''}
        products={selectedOrder?.items || []}
        total={selectedOrder?.totalPrice || 0}
        pointDiscount={selectedOrder?.discount_point || 0}
      />
    </div>
  );
};

export default Dashboard;
