import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { TbLogout } from 'react-icons/tb'

export default function DialogSignout() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    try {
      localStorage.clear()
      window.location.href = '/'
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
  return (
    <React.Fragment>
      <div
        onClick={handleClickOpen}
        className='cursor-pointer ml-4 flex items-center rounded-bl-2xl rounded-tl-2xl py-4 px-8 h-[60px] gap-4'
      >
        <TbLogout size={25} />
        <span className='text-base'>Đăng xuất</span>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Bạn có chắc chắn muốn đăng xuất?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: '#000000'
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              color: '#ff8108'
            }}
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
