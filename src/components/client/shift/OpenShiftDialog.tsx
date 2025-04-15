import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { User } from '@/services/auth.service'
import { Role } from '@/consts'

interface OpenShiftDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { opening_cash: number }) => void
  user: User
}

const OpenShiftDialog: React.FC<OpenShiftDialogProps> = ({ open, onClose, onSubmit, user }) => {
  const { register, handleSubmit } = useForm<{ opening_cash: number }>()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Mở ca làm việc</DialogTitle>
      {user.role.includes(Role.SALESTAFF) && (
        <DialogContent>
          <Typography variant='body2' mb={1}>
            Nhập số tiền mở ca (tiền mặt có sẵn trong két):
          </Typography>
          <NumericFormat
            {...register('opening_cash', { required: true })}
            placeholder='Ví dụ: 500.000'
            thousandSeparator='.'
            decimalSeparator=','
            className='bg-white border border-black/50 px-4 h-[55px] rounded-2xl w-full outline-none'
          />
        </DialogContent>
      )}
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: '#000000'
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          color='primary'
          sx={{
            backgroundColor: '#ff8108',
            color: 'white'
          }}
        >
          Xác nhận mở ca
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OpenShiftDialog
