import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IoSearch } from 'react-icons/io5'
import { useEffect, useState } from 'react'

export interface Order {
  id: string
  code: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

interface OrderHistoryDialogProps {
  open: boolean
  onClose: () => void
  orders: Order[]
}

const OrderHistoryDialog = ({ open, onClose, orders }: OrderHistoryDialogProps) => {
  const [searchText, setSearchText] = useState('')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)

  useEffect(() => {
    if (!searchText) {
      setFilteredOrders(orders)
    } else {
      const lowerSearch = searchText.toLowerCase()
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.customerName.toLowerCase().includes(lowerSearch) || order.code.toLowerCase().includes(lowerSearch)
        )
      )
    }
  }, [searchText, orders])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Lịch sử đơn hàng
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Paper
          component='form'
          sx={{
            p: '2px 8px',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#f1f1f1'
          }}
        >
          <IoSearch size={20} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder='Tìm kiếm theo mã đơn hoặc tên khách hàng'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Paper>

        {filteredOrders.length === 0 ? (
          <Typography textAlign='center' py={3} color='text.secondary'>
            Bạn chưa có đơn hàng nào
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.code}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.totalAmount.toLocaleString()} đ</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrderHistoryDialog
