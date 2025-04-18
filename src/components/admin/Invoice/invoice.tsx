import { useState, ChangeEvent } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  Box,
  CircularProgress
} from '@mui/material'
import { IoSearch } from 'react-icons/io5'
import DialogViewHistory from '@/components/admin/Invoice/components/dialog'
import { useHistory } from '@/hooks/useHistory'
import { formatCurrency, formatDate } from '@/helpers'
import { ORDER_STATUS } from '@/consts'

interface Order {
  orderId: string
  customerName: string
  phoneNumber: string
  payment_method: string
  createdAt: string
  createdBy: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  totalPrice: number
  discount_point: number
  status: string
}

const InvoicePage = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const accessToken = localStorage.getItem('accessToken') || ''
  const { data, isLoading } = useHistory({ accessToken, page, limit })
  const orderedHistory = data?.data?.data || []
  const totalPages = data?.data?.totalPages || 1

  const filtered = orderedHistory.filter(order =>
    order.orderId.includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const openDialog = (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl p-4 shadow-md'>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
          <h1 className='text-2xl font-bold'>Lịch sử mua hàng</h1>
          <Box className='bg-white flex items-center gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
            <IoSearch size={25} />
            <input
              type='text'
              placeholder='Tìm kiếm đơn hàng'
              className='text-black border-none outline-none w-full hidden md:block'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label='history table'>
            <TableHead>
              <TableRow>
                <TableCell className='w-[80px]'>Số thứ tự</TableCell>
                <TableCell className='w-[120px]'>Mã đơn hàng</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Ngày đặt hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <CircularProgress size={30} sx={{ color: 'black', opacity: 0.2 }} />
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map((order, idx) => (
                  <TableRow
                    key={order.orderId}
                    hover
                    className='hover:bg-amber-50'
                    onClick={() => openDialog(order)}
                  >
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className='flex justify-center'>
                      <Box
                        className={`max-w-[100px] py-2 px-4 rounded-xl text-center ${
                          order.status.toUpperCase() === ORDER_STATUS.CANCELED
                            ? 'bg-red text-red'
                            : 'bg-green text-green'
                        }`}
                      >
                        {order.status}
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice || 0)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center' className='p-4'>
                    Hiện tại bạn chưa có đơn hàng nào
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
      </div>

      {/* Dialog Hiển thị chi tiết đơn hàng khi click vào dòng */}
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

export default InvoicePage