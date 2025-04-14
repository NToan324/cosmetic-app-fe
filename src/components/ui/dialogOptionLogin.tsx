import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/material'
import CustomerImage from '@/assets/images/customer.png'
import EmployeeImage from '@/assets/images/employee.png'

export default function DialogLoginChoice() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <button onClick={handleClickOpen} className='bg-[#ff8108]/20 rounded-2xl px-4 py-2 text-primary cursor-pointer'>
        Login
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='font-bold!'>
          Choose your role
        </DialogTitle>
        <DialogContent>
          <Box display='flex' justifyContent='space-around' alignItems='center' gap={2} mb={2}>
            <Button
              href='/auth/login'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                color: '#000000',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 129, 8, 0.3)'
                }
              }}
            >
              <img src={EmployeeImage} alt='employee' className='w-50 h-50 object-cover' />
              <h3 className='font-bold text-xl'>Employee</h3>
            </Button>
            <Button
              href='/auth/login'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                color: '#000000',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 129, 8, 0.3)'
                }
              }}
            >
              <img src={CustomerImage} alt='customer' className='w-50 h-50 object-cover' />
              <h3 className='font-bold text-xl'>Customer</h3>
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: '#ff8108'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
