import { useState, useEffect } from 'react';
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { format, subDays, startOfMonth, endOfDay, startOfDay } from 'date-fns';
import { useHistory } from '@/hooks/useHistory';
import { ORDER_STATUS } from '@/consts';
import StatisticTable from '@/components/admin/Statistic/components/StatisticTable'
import { OrderHistory } from '@/services/order.service';
import { ChartEvent, ActiveElement } from 'chart.js';

const StatisticPage = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [statType, setStatType] = useState('totalRevenue');
  const [filteredOrders, setFilteredOrders] = useState<OrderHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const accessToken = localStorage.getItem('accessToken') || '';
  const { data } = useHistory({ accessToken, page: 1, limit: 1000 });
  const orders = data?.data?.data || [];

  useEffect(() => {
    let fromDate = startOfDay(new Date());
    let toDate = endOfDay(new Date());

    switch (timeRange) {
      case 'yesterday':
        fromDate = startOfDay(subDays(new Date(), 1));
        toDate = endOfDay(subDays(new Date(), 1));
        break;
      case 'last7days':
        fromDate = startOfDay(subDays(new Date(), 6));
        break;
      case 'thisMonth':
        fromDate = startOfMonth(new Date());
        break;
      case 'custom':
        fromDate = customFrom ? startOfDay(new Date(customFrom)) : fromDate;
        toDate = customTo ? endOfDay(new Date(customTo)) : toDate;
        break;
    }

    setFilteredOrders(orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= fromDate && orderDate <= toDate;
    }));
  }, [timeRange, customFrom, customTo, data]);

  const groupedData = filteredOrders.reduce<Record<string, number>>((acc, order) => {
    const date = format(new Date(order.createdAt), 'dd/MM');
    const value =
      statType === 'productsSold'
        ? order.items.reduce((sum, item) => sum + item.quantity, 0)
        : statType === 'completedInvoices' && order.status === ORDER_STATUS.COMPLETED
        ? 1
        : statType === 'cancelledInvoices' && order.status === ORDER_STATUS.CANCELED
        ? 1
        : statType === 'totalRevenue' && order.status === ORDER_STATUS.COMPLETED
        ? order.totalPrice
        : 0;

    acc[date] = (acc[date] || 0) + value;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [{ label: statType, data: Object.values(groupedData), backgroundColor: 'rgba(54,162,235,0.5)' }]
  };

  const handleColumnClick = (evt: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      setSelectedDate(chartData.labels[elements[0].index]);
    }
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <Grid container spacing={2}>
        <Grid size={{xs:12, md:6}}>
          <FormControl fullWidth>
            <InputLabel>Thời gian thống kê</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <MenuItem value='today'>Hôm nay</MenuItem>
              <MenuItem value='yesterday'>Hôm qua</MenuItem>
              <MenuItem value='last7days'>7 ngày trước</MenuItem>
              <MenuItem value='thisMonth'>Tháng này</MenuItem>
              <MenuItem value='custom'>Tự chọn</MenuItem>
            </Select>
          </FormControl>
          {timeRange === 'custom' && (
            <Box display='flex' gap={2} mt={2}>
              <TextField type='date' label='Từ ngày' InputLabelProps={{ shrink: true }} value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              <TextField type='date' label='Đến ngày' InputLabelProps={{ shrink: true }} value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </Box>
          )}
        </Grid>
        <Grid size={{xs:12, md:6}}>
          <FormControl fullWidth>
            <InputLabel>Loại thống kê</InputLabel>
            <Select value={statType} onChange={(e) => setStatType(e.target.value)}>
              <MenuItem value='productsSold'>Sản phẩm đã bán</MenuItem>
              <MenuItem value='completedInvoices'>Hóa đơn Completed</MenuItem>
              <MenuItem value='cancelledInvoices'>Hóa đơn Cancelled</MenuItem>
              <MenuItem value='totalRevenue'>Tổng doanh thu</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box className='bg-white p-6 rounded-lg shadow mt-4'>
        <Bar data={chartData} options={{ onClick: handleColumnClick }} />
      </Box>

      <StatisticTable orders={filteredOrders} selectedDate={selectedDate} />
    </div>
  );
};

export default StatisticPage;
