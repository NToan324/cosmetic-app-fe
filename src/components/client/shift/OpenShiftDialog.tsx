import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import { User } from '@/services/auth.service'
import { Role } from '@/consts'

interface OpenShiftDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (opening_cash: number) => void
  user: User
  isLoading?: boolean
}

const OpenShiftDialog: React.FC<OpenShiftDialogProps> = ({ open, onClose, onSubmit, user, isLoading }) => {
  const [openingCash, setOpeningCash] = useState<number>(0)
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Mở ca làm việc</DialogTitle>
      {user.role.includes(Role.SALESTAFF) && (
        <DialogContent>
          <Typography variant='body2' mb={1}>
            Nhập số tiền mở ca (tiền mặt có sẵn trong két):
          </Typography>
          <NumericFormat
            onChange={(e) => {
              setOpeningCash(Number(e.target.value.replace(/\./g, '').replace(/,/g, '.')))
            }}
            defaultValue={openingCash}
            placeholder='Ví dụ: 500.000'
            thousandSeparator='.'
            decimalSeparator=','
            className='bg-white border border-black/50 px-4 h-[55px] rounded-[4px] w-full outline-none'
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
          onClick={() => onSubmit(openingCash)}
          variant='contained'
          color='primary'
          sx={{
            backgroundColor: '#ff8108',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
          disabled={isLoading}
        >
          {isLoading && (
            <CircularProgress
              size={20}
              sx={{
                color: 'black',
                opacity: 0.2
              }}
            />
          )}
          Xác nhận mở ca
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OpenShiftDialog
