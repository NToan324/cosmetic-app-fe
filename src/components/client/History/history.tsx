import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ORDER_STATUS } from '@/consts'
import { formatCurrency } from '@/helpers'

import { cosmeticOrdersHistory } from '@/mockup/cosmeticOrdersHistory'
import DialogViewHistory from '@/components/ui/dialogViewHistory'

const History = () => {
  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl p-4 shadow-md'>
        <h1 className='text-2xl font-bold text-start mb-4'>Lịch sử mua hàng</h1>
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
            {cosmeticOrdersHistory && cosmeticOrdersHistory.length > 0 ? (
              cosmeticOrdersHistory.map((order, index) => (
                <TableRow key={index} className='hover:bg-amber-50'>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell className='flex justify-center'>
                    <div
                      className={`${order.status.toUpperCase() == ORDER_STATUS.CANCELED ? 'bg-red text-red' : 'bg-green text-green'} max-w-[100px] py-2 px-4 rounded-xl `}
                    >
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <DialogViewHistory
                      customerName={order.customerName}
                      phoneNumber={order.phoneNumber}
                      orderId={order.orderId}
                      paymentMethod={order.paymentMethod}
                      orderDate={order.orderDate}
                      employeeName={order.employeeName}
                      products={order.products}
                      total={order.total}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='text-center'>
                  Bạn chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default History
