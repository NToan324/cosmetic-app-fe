import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  TooltipProps
} from 'recharts'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  CircularProgress,
  Grid
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import orderService, { OrderHistory } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/helpers'
import DialogViewHistory from '@/components/admin/Invoice/components/dialog'
import { FaBox, FaFileInvoice, FaMoneyBillWaveAlt } from 'react-icons/fa'

interface StatisticData {
  date: string
  // giá trị dùng để vẽ bar
  completedValue: number
  canceledValue: number
  // số đơn (đếm orders) để show trong tooltip
  completedCount: number
  canceledCount: number
}
// 1) Định nghĩa interface cho item trong payload
interface TooltipItem {
  dataKey?: string
  value?: number
  payload?: {
    completedCount: number
    canceledCount: number
  }
}

// 2) CustomTooltip đặt ngay đầu file, trước StatisticPage
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null

  // chuyển payload sang array có type rõ
  const items = payload as TooltipItem[]

  const compItem = items.find((p) => p.dataKey === 'completedValue')
  const cancItem = items.find((p) => p.dataKey === 'canceledValue')
  if (!compItem || !cancItem || compItem.value == null || cancItem.value == null) return null

  const completedValue = compItem.value
  const canceledValue = cancItem.value
  const totalValue = completedValue + canceledValue

  // lấy count từ payload
  const completedCount = compItem.payload?.completedCount ?? 0
  const canceledCount = compItem.payload?.canceledCount ?? 0

  return (
    <Paper sx={{ p: 1 }}>
      <Typography>{label}</Typography>
      <Typography variant='body2'>Total: {totalValue.toLocaleString()}</Typography>
      <Typography variant='body2'>
        {completedValue.toLocaleString()} (completed: {completedCount}) – {canceledValue.toLocaleString()} (canceled:{' '}
        {canceledCount})
      </Typography>
    </Paper>
  )
}
const StatisticPage = () => {
  const [timeRange, setTimeRange] = useState('today')
  const [dataType, setDataType] = useState('orders')
  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null)
  const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null)
  const [chartData, setChartData] = useState<StatisticData[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [detailedOrders, setDetailedOrders] = useState<OrderHistory[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0)
  const [completedProductsCount, setCompletedProductsCount] = useState(0)
  const [completedRevenueValue, setCompletedRevenueValue] = useState(0)

  const accessToken = localStorage.getItem('accessToken') || ''
  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        let startDate: Dayjs
        let endDate: Dayjs = dayjs()
        const now = dayjs()

        switch (timeRange) {
          case 'yesterday':
            startDate = now.subtract(1, 'day')
            endDate = startDate
            break
          case 'today':
            startDate = now
            break
          case 'last3days':
            startDate = now.subtract(2, 'day')
            break
          case 'last7days':
            startDate = now.subtract(6, 'day')
            break
          case 'thisMonth':
            startDate = now.startOf('month')
            break
          case 'thisYear':
            startDate = now.startOf('year')
            break
          case 'custom':
            startDate = customStartDate || now
            endDate = customEndDate || now
            break
          default:
            startDate = now
        }

        const response = await orderService.getOrderHistory(accessToken, 1, 1000) // Fetch large limit for stats
        const orders = response.data.data

        const filteredOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdAt)
          return orderDate.isAfter(startDate.startOf('day')) && orderDate.isBefore(endDate.endOf('day'))
        })

        const dataMap: Record<string, StatisticData> = {}
        filteredOrders.forEach((order) => {
          const date = dayjs(order.createdAt).format('YYYY-MM-DD')
          if (!dataMap[date]) {
            dataMap[date] = {
              date,
              completedValue: 0,
              canceledValue: 0,
              completedCount: 0,
              canceledCount: 0
            }
          }

          const bucket = dataMap[date]
          if (dataType === 'orders') {
            // mỗi order = 1 đơn
            if (order.status === 'Completed') {
              bucket.completedValue += 1
              bucket.completedCount += 1
            } else {
              bucket.canceledValue += 1
              bucket.canceledCount += 1
            }
          } else if (dataType === 'products') {
            // mỗi order có N sản phẩm
            const items = order.items.reduce((s, i) => s + i.quantity, 0)
            if (order.status === 'Completed') {
              bucket.completedValue += items
              bucket.completedCount += 1
            } else {
              bucket.canceledValue += items
              bucket.canceledCount += 1
            }
          } /* revenue */ else {
            if (order.status === 'Completed') {
              bucket.completedValue += order.totalPrice
              bucket.completedCount += 1
            } else {
              bucket.canceledValue += order.totalPrice
              bucket.canceledCount += 1
            }
          }
        })

        // lọc ra mảng chỉ chứa đơn COMPLETED
        const completedOrders = filteredOrders.filter((o) => o.status === 'Completed')

        // 1) số hóa đơn completed
        setCompletedOrdersCount(completedOrders.length)

        // 2) tổng sản phẩm của các đơn completed
        const productsSold = completedOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
        setCompletedProductsCount(productsSold)

        // 3) tổng doanh thu của các đơn completed
        const revenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0)
        setCompletedRevenueValue(revenue)

        const processedData = Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date))
        setChartData(processedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, dataType, customStartDate, customEndDate, accessToken])

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value as string)
    setSelectedDate(null)
    setDetailedOrders([])
  }

  const handleDataTypeChange = (event: SelectChangeEvent<string>) => {
    setDataType(event.target.value as string)
    setSelectedDate(null)
    setDetailedOrders([])
  }

  const handleBarClick = (data: StatisticData) => {
    setSelectedDate(data.date)
    setDetailedOrders([]) // reset
    orderService
      .getOrderHistory(accessToken, 1, 1000)
      .then((res) => {
        const all = res.data.data.filter((o) => dayjs(o.createdAt).format('YYYY-MM-DD') === data.date)
        setDetailedOrders(all)
        setPage(1)
      })
      .catch(console.error)
  }

  const openDialog = (order: OrderHistory) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const paginatedOrders = detailedOrders.slice((page - 1) * limit, page * limit)
  const totalPages = Math.ceil(detailedOrders.length / limit)

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <Box display='flex' justifyContent='space-between' mb={4}>
        <FormControl variant='outlined' sx={{ minWidth: 200 }}>
          <InputLabel>Thời gian</InputLabel>
          <Select value={timeRange} onChange={handleTimeRangeChange} label='Thời gian'>
            <MenuItem value='yesterday'>Hôm qua</MenuItem>
            <MenuItem value='today'>Hôm nay</MenuItem>
            <MenuItem value='last3days'>3 ngày qua</MenuItem>
            <MenuItem value='last7days'>7 ngày qua</MenuItem>
            <MenuItem value='thisMonth'>Tháng này</MenuItem>
            <MenuItem value='thisYear'>Năm này</MenuItem>
            <MenuItem value='custom'>Tùy chỉnh</MenuItem>
          </Select>
        </FormControl>
        {timeRange === 'custom' && (
          <Box display='flex' gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Từ ngày'
                value={customStartDate}
                onChange={(newValue) => setCustomStartDate(newValue)}
              />
              <DatePicker label='Đến ngày' value={customEndDate} onChange={(newValue) => setCustomEndDate(newValue)} />
            </LocalizationProvider>
          </Box>
        )}
        <FormControl variant='outlined' sx={{ minWidth: 200 }}>
          <InputLabel>Loại dữ liệu</InputLabel>
          <Select value={dataType} onChange={handleDataTypeChange} label='Loại dữ liệu'>
            <MenuItem value='orders'>Số hóa đơn</MenuItem>
            <MenuItem value='products'>Số sản phẩm bán ra</MenuItem>
            <MenuItem value='revenue'>Tổng doanh thu</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box className='bg-purple-500 text-white p-4 rounded-lg shadow-md'>
            <div className='flex justify-between'>
              <p className='text-sm'>SỐ HÓA ĐƠN ĐÃ HOÀN THÀNH</p>
              <FaFileInvoice />
            </div>
            <div className='text-left'>
              <p className='text-xl font-bold'>{completedOrdersCount}</p>
            </div>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box className='bg-blue-500 text-white p-4 rounded-lg shadow-md'>
            <div className='flex justify-between'>
              <p className='text-sm'>SẢN PHẨM BÁN RA ĐÃ HOÀN THÀNH</p>
              <FaBox />
            </div>
            <div className='text-left'>
              <p className='text-xl font-bold'>{completedProductsCount}</p>
            </div>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box className='bg-green-500 text-white p-4 rounded-lg shadow-md'>
            <div className='flex justify-between'>
              <p className='text-sm'>DOANH THU ĐÃ HOÀN THÀNH</p>
              <FaMoneyBillWaveAlt />
            </div>
            <div className='text-left'>
              <p className='text-xl font-bold'>{completedRevenueValue.toLocaleString()}</p>
            </div>
          </Box>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box display='flex' justifyContent='center' mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 4, mb: 4 }}>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar dataKey='completedValue' name='Completed' fill='#82ca9d' onClick={handleBarClick}>
                <LabelList dataKey='completedValue' position='top' />
              </Bar>

              <Bar dataKey='canceledValue' name='Canceled' fill='#8884d8' onClick={handleBarClick}>
                <LabelList dataKey='canceledValue' position='top' />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
      <div className='border-t border-gray-300 w-full'></div>
      {selectedDate && (
        <Box mt={4}>
          <Typography variant='h6'>Chi tiết cho ngày {selectedDate}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label='detailed orders table'>
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
                    <TableRow key={order.orderId} hover onClick={() => openDialog(order)} className='hover:bg-amber-50'>
                      <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Box
                          className={`max-w-[100px] py-2 px-4 rounded-xl text-center ${
                            order.status.toUpperCase() === 'CANCELED' ? 'bg-red text-red' : 'bg-green text-green'
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
                    <TableCell colSpan={6} align='center'>
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
              variant='outlined'
              shape='rounded'
              onChange={(_, v) => setPage(v)}
            />
          </Stack>
        </Box>
      )}

      {selectedOrder && (
        <DialogViewHistory
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          customerName={selectedOrder.customerName}
          phoneNumber={selectedOrder.phoneNumber}
          orderId={selectedOrder.orderId}
          paymentMethod={selectedOrder.payment_method}
          orderDate={selectedOrder.createdAt}
          employeeName={selectedOrder.createdBy}
          products={selectedOrder.items}
          total={selectedOrder.totalPrice}
          pointDiscount={selectedOrder.discount_point}
        />
      )}
    </div>
  )
}

export default StatisticPage
