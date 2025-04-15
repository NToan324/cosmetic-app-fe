import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid
} from '@mui/material'
import { formatCurrency } from '@/helpers'
import { OrderedProductInterface } from '../../Order/order'

interface PaymentDialogProps {
  open: boolean
  onClose: () => void
  amount: number
  orderedTempProducts: Array<OrderedProductInterface>
  pointDiscount: number
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(10)
  const [resetTransaction, setResetTransaction] = useState(false)

  useEffect(() => {
    setTimeLeft(10)
    const intervalTimeLeft = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(intervalTimeLeft)
          return 0
        }
        return prevTimeLeft - 1
      })
    }, 1000)

    return () => {
      clearInterval(intervalTimeLeft)
    }
  }, [resetTransaction])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle flex={1} display='flex' justifyContent='space-between' alignItems='center'>
        <Button onClick={onClose} sx={{ fontSize: '0.875rem', color: '#000000' }}>
          Quay lại
        </Button>
        <Box>
          <Typography variant='body1' component='span' color='red'>
            {timeLeft > 0 ? `Giao dịch hết hạn sau ${timeLeft} giây` : 'Giao dịch đã hết hạn'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Bên trái: Thông tin đơn hàng */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'flex-start',
              padding: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}
          >
            <Typography variant='h6' fontWeight='bold' gutterBottom>
              Thông tin đơn hàng (Test)
            </Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
            <Box mt={2} display={'flex'} flexDirection='column' gap={2}>
              <Typography className='text-primary flex flex-col items-start'>
                Số tiền thanh toán
                <span className='text-2xl'> {formatCurrency(10000)}</span>
              </Typography>
              <Typography className=' flex flex-col items-start'>
                <strong>Giá trị đơn hàng:</strong> <span> {formatCurrency(10000)}</span>
              </Typography>
              <Typography className=' flex flex-col items-start'>
                <strong>Phí giao dịch:</strong> <span> {formatCurrency(10000)}</span>
              </Typography>
              <Typography className=' flex flex-col items-start'>
                <strong>Mã đơn hàng:</strong> <span> {formatCurrency(10000)}</span>
              </Typography>
              <Typography className=' flex flex-col items-start'>
                <strong>Nhà cung cấp:</strong> <span> {formatCurrency(10000)}</span>
              </Typography>
            </Box>
          </Grid>

          {/* Bên phải: QR code và thanh toán */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='h6' fontWeight='bold' gutterBottom textAlign={'center'}>
              Quét mã qua ứng dụng Ngân hàng/ Ví điện tử
            </Typography>

            <Typography variant='body2' color='text.secondary' mb={1}>
              <a href='#'>Hướng dẫn thanh toán</a>
            </Typography>

            <Box display='flex' justifyContent='center' mb={2}>
              <img
                src='https://img.vietqr.io/image/970415-000000000001-pay_qr.jpg'
                alt='QR Code'
                style={{ width: 300, height: 300 }}
              />
            </Box>

            <Typography variant='caption' textAlign='center' display='block'>
              Scan to Pay
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant='outlined'
          sx={{
            border: '1px solid #ff8108',
            backgroundColor: '#fff',
            color: '#ff8108'
          }}
          color='error'
          onClick={onClose}
        >
          Hủy thanh toán
        </Button>
        {timeLeft === 0 && (
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#ff8108',
              color: '#fff'
            }}
            onClick={() => setResetTransaction(!resetTransaction)}
          >
            Giao dịch mới
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog
