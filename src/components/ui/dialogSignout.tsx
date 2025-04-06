import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'
import { TbLogout } from 'react-icons/tb'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'

export default function DialogSignout() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(AppContext)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    try {
      const user = localStorage.getItem('user')
      const parsedUser = user ? JSON.parse(user) : null
      const role = Array.isArray(parsedUser?.role) ? parsedUser.role : []
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      setUser(null)
      if (role.includes('CUSTOMER')) {
        navigate('/auth/client/login')
      } else if (role.length > 0) {
        navigate('/auth/employee/login')
      }
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
        <span className='text-base'>Logout</span>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Logout'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: '#000000'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              color: '#ff8108'
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
