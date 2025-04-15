import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'

interface CloseShiftDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (actual_cash: number, note: string) => void
  isLoading: boolean
}

const CloseShiftDialog = ({ open, onClose, onSubmit, isLoading }: CloseShiftDialogProps) => {
  const [actualCash, setActualCash] = useState<number>(0)
  const [note, setNote] = useState<string>('')

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Đóng ca làm việc</DialogTitle>
      <DialogContent>
        <NumericFormat
          onChange={(e) => {
            setActualCash(Number(e.target.value.replace(/\./g, '').replace(/,/g, '.')))
          }}
          defaultValue={actualCash}
          placeholder='Ví dụ: 500.000'
          thousandSeparator='.'
          decimalSeparator=','
          className='bg-white border border-black/50 px-4 h-[55px] rounded-[4px] w-full outline-none'
        />
        <TextField
          fullWidth
          label='Ghi chú (nếu có)'
          onChange={(e) => {
            setNote(e.target.value)
          }}
          multiline
          rows={3}
          margin='normal'
        />
      </DialogContent>
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
          onClick={() => onSubmit(actualCash, note)}
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
          Xác nhận đóng ca
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CloseShiftDialog
