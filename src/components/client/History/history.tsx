import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ORDER_STATUS } from '@/consts'
import { formatCurrency, formatDate } from '@/helpers'

import DialogViewHistory from '@/components/ui/dialogViewHistory'
import { useHistory } from '@/hooks/useHistory'
import { CircularProgress, Pagination, Stack } from '@mui/material'
import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'

const History = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  const accessToken = localStorage.getItem('accessToken') || ''
  const { data, isLoading } = useHistory({ accessToken, page, limit })
  const orderedHistory = data?.data?.data || []
  const totalPages = data?.data?.totalPages || 1

  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl p-4 shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-start'>Lịch sử mua hàng</h1>
          <div className='bg-white flex items-center justify-between gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
            <IoSearch size={25} color='black' />
            <input
              type='text'
              placeholder='Tìm kiếm đơn hàng'
              className='text-black border-none outline-none w-full hidden md:block'
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>Số thứ tự</TableHead>
              <TableHead className='w-[120px]'>Mã đơn hàng</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Ngày đặt hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading ? (
              orderedHistory && orderedHistory.length > 0 ? (
                orderedHistory.map((order, index) => (
                  <TableRow key={index} className='hover:bg-amber-50'>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className='flex justify-center'>
                      <div
                        className={`${order.status.toUpperCase() == ORDER_STATUS.CANCELED ? 'bg-red text-red' : 'bg-green text-green'} max-w-[100px] py-2 px-4 rounded-xl `}
                      >
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice || 0)}</TableCell>
                    <TableCell>
                      <DialogViewHistory
                        customerName={order.customerName}
                        phoneNumber={order.phoneNumber}
                        orderId={order.orderId}
                        paymentMethod={order.payment_method}
                        orderDate={order.createdAt}
                        employeeName={order.createdBy}
                        products={order.items}
                        total={order.totalPrice}
                        pointDiscount={order.discount_point}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='text-center p-4'>
                    Hiện tại bạn chưa có đơn hàng nào
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={7} className='text-center'>
                  <CircularProgress
                    size={30}
                    className='my-10'
                    sx={{
                      color: 'black',
                      opacity: 0.2
                    }}
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            variant='outlined'
            shape='rounded'
            onChange={(_event, value) => {
              setPage(value)
            }}
          />
        </Stack>
      </div>
    </div>
  )
}

export default History
