import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
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
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant='contained'
        onClick={handleClickOpen}
        sx={{
          backgroundColor: '#ff8108',
          borderColor: '#ff8108',
          color: 'white',
          borderRadius: '12px',
          textTransform: 'capitalize',
          '&:hover': {
            backgroundColor: '#ff8108'
          }
        }}
      >
        Chi tiết
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' maxWidth='lg' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Order Details
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
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
          <h2 className='text-xl font-bold mt-4'>Cảm ơn bạn đã mua hàng!</h2>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Thông tin cửa hàng</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Địa chỉ</p>
                <p className='text-base'>Quận 7 Hồ Chí Minh</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Số điện thoại</p>
                <p className='text-base'>0939000111</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Thông tin khách hàng</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Tên khách hàng</p>
                <p className='text-base'>{customerName}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Số điện thoại</p>
                <p className='text-base'>{phoneNumber}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Thông tin hóa đơn</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Mã đơn hàng</p>
                <p className='text-base'>{orderId}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Phương thức thanh toán</p>
                <p className='text-base'>{paymentMethod === 'Cash' ? 'Tiền mặt' : 'VNPay'}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Ngày tạo đơn</p>
                <p className='text-base'>{formatDate(orderDate)}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Tên nhân viên</p>
                <p className='text-base'>{employeeName}</p>
              </div>
            </div>
          </div>
          <Table className='border border-black mt-10'>
            <TableHeader>
              <TableRow>
                <TableHead className='border border-black'>Số thứ tự</TableHead>
                <TableHead className='border border-black'>Mã sản phẩm</TableHead>
                <TableHead className='border border-black'>Tên sản phẩm</TableHead>
                <TableHead className='border border-black'>Số lượng</TableHead>
                <TableHead className='border border-black'>Giá</TableHead>
                <TableHead className='border border-black'>Giảm giá</TableHead>
                <TableHead className='border border-black'>Tổng giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className='border border-black'>{index + 1}</TableCell>
                    <TableCell className='border border-black'>{product.productId}</TableCell>
                    <TableCell className='max-w-[150px] border border-black'>{product.productName}</TableCell>
                    <TableCell className='text-center border border-black'>{product.quantity}</TableCell>
                    <TableCell className='border border-black'>{formatCurrency(product.price)}</TableCell>
                    <TableCell className='border border-black'>0</TableCell>
                    <TableCell className='border border-black'>
                      {formatCurrency(product.price * product.quantity)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='text-center'>
                    No data available
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
          {pointDiscount > 0 && (
            <h3 className='text-end text-base mt-4'>
              Bạn được giảm {formatCurrency(pointDiscount)} từ điểm thành viên
            </h3>
          )}
          <div className='flex justify-end items-center mt-4 gap-2'>
            <h3 className='text-base font-semibold'>Tổng hóa đơn</h3>
            <h3 className='text-base font-semibold'>{formatCurrency(total)}</h3>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              textTransform: 'capitalize',
              color: '#ff8108'
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              textTransform: 'capitalize',
              color: '#ff8108'
            }}
          >
            Print
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  )
}
