import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

type ConfirmCancelDialogProps = {
  open: boolean
  onClose: () => void
  onConfirmCash: () => void
  onCancelOrder: () => void
}

export const ChangePayment = ({ open, onClose, onConfirmCash, onCancelOrder }: ConfirmCancelDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận hủy thanh toán</DialogTitle>
      <DialogContent>
        <Typography>Bạn có muốn thanh toán bằng tiền mặt không? Nếu không, đơn hàng sẽ bị hủy.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelOrder} color='error' sx={{ color: '#ff8108' }}>
          Hủy đơn hàng
        </Button>
        <Button
          onClick={onConfirmCash}
          color='primary'
          sx={{
            backgroundColor: '#ff8108',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ff8108',
              opacity: 0.9
            }
          }}
          variant='contained'
        >
          Thanh toán tiền mặt
        </Button>
      </DialogActions>
    </Dialog>
  )
}
