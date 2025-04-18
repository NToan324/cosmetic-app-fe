import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography
} from '@mui/material'
import { formatCurrency, formatDate } from '@/helpers'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

interface DialogViewHistoryProps {
  open: boolean
  onClose: () => void
  customerName: string
  phoneNumber: string
  orderId: string
  paymentMethod: string
  orderDate: string
  employeeName: string
  products: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  pointDiscount: number
}

export default function DialogViewHistory({
  open,
  onClose,
  customerName,
  phoneNumber,
  orderId,
  paymentMethod,
  orderDate,
  employeeName,
  products,
  total,
  pointDiscount
}: DialogViewHistoryProps) {
  return (
    <BootstrapDialog onClose={onClose} aria-labelledby='customized-dialog-title' maxWidth='lg' open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        Order Details
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <h1 className='text-primary font-bold text-2xl'>
            ORR’ <span className='text-black'>COSMETIC</span>
        </h1>
        <Typography variant='h5' fontWeight='bold' mt={4}>
          Cảm ơn bạn đã mua hàng!
        </Typography>

        {/* Store Info */}
        <Box mt={4}>
          <Typography fontWeight='bold'>Thông tin cửa hàng</Typography>
          <Box display='flex' gap={8} mt={1}>
            <Box>
              <Typography color='text.secondary'>Địa chỉ</Typography>
              <Typography>Quận 7 Hồ Chí Minh</Typography>
            </Box>
            <Box>
              <Typography color='text.secondary'>Số điện thoại</Typography>
              <Typography>0939000111</Typography>
            </Box>
          </Box>
        </Box>

        {/* Customer Info */}
        <Box mt={4}>
          <Typography fontWeight='bold'>Thông tin khách hàng</Typography>
          <Box display='flex' gap={8} mt={1}>
            <Box>
              <Typography color='text.secondary'>Tên khách hàng</Typography>
              <Typography>{customerName}</Typography>
            </Box>
            <Box>
              <Typography color='text.secondary'>Số điện thoại</Typography>
              <Typography>{phoneNumber}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Order Info */}
        <Box mt={4}>
          <Typography fontWeight='bold'>Thông tin hóa đơn</Typography>
          <Box display='flex' flexWrap='wrap' gap={8} mt={1}>
            <Box>
              <Typography color='text.secondary'>Mã đơn hàng</Typography>
              <Typography>{orderId}</Typography>
            </Box>
            <Box>
              <Typography color='text.secondary'>Phương thức thanh toán</Typography>
              <Typography>{paymentMethod === 'Cash' ? 'Tiền mặt' : 'VNPay'}</Typography>
            </Box>
            <Box>
              <Typography color='text.secondary'>Ngày tạo đơn</Typography>
              <Typography>{formatDate(orderDate)}</Typography>
            </Box>
            <Box>
              <Typography color='text.secondary'>Tên nhân viên</Typography>
              <Typography>{employeeName}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Product Table */}
        <Table sx={{ mt: 5, border: '1px solid black' }}>
          <TableHead>
            <TableRow>
              {['Số thứ tự', 'Mã sản phẩm', 'Tên sản phẩm', 'Số lượng', 'Giá', 'Giảm giá', 'Tổng giá'].map((header, i) => (
                <TableCell key={i} sx={{ border: '1px solid black' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: '1px solid black' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>{product.productId}</TableCell>
                  <TableCell sx={{ border: '1px solid black', maxWidth: '150px' }}>{product.productName}</TableCell>
                  <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{product.quantity}</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>{formatCurrency(product.price)}</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>0</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>{formatCurrency(product.price * product.quantity)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Discounts & Total */}
        {pointDiscount > 0 && (
          <Typography align='right' mt={4}>
            Bạn được giảm {formatCurrency(pointDiscount)} từ điểm thành viên
          </Typography>
        )}
        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
          <Typography fontWeight='bold'>Tổng hóa đơn</Typography>
          <Typography fontWeight='bold'>{formatCurrency(total)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ backgroundColor: '#ef5350', color: 'white' }}>
          Đóng
        </Button>
      </DialogActions>
    </BootstrapDialog>
  )
}
