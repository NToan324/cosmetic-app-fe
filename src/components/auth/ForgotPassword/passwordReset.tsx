import { useState } from 'react'
import { Avatar, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { TbLockPassword } from 'react-icons/tb'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { Link, useLocation } from 'react-router-dom'

const PasswordReset = () => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false)
  const location = useLocation()
  const { active } = location.state || { active: 'reset' }
  const handleToggleNewPassword = () => {
    setShowNewPassword((prev) => !prev)
  }

  const handleToggleNewPasswordAgain = () => {
    setShowNewPasswordAgain((prev) => !prev)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-50'>
      <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
        {/* Header */}
        <div className='flex flex-col items-center mb-6'>
          <Avatar sx={{ width: 80, height: 80, mt: 4, mb: 6 }} style={{ backgroundColor: '#ff8108' }}>
            <TbLockPassword style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className='text-2xl font-bold'>{`${active === 'reset' ? 'Reset Your Password' : 'Change Your Password'}`}</h1>
          <p className='text-gray-600 mt-2 text-center'>{`${active === 'reset' ? 'Please enter your new password' : 'This is your first time logging in, please set a new password to access your account'}`}</p>
        </div>

        {/* New Password */}
        <TextField
          fullWidth
          label='New Password'
          variant='standard'
          margin='normal'
          type={showNewPassword ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleToggleNewPassword}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiInput-underline:after': {
              borderBottomColor: 'orange'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'orange'
            }
          }}
        />
        {/*  New Password again */}
        <TextField
          fullWidth
          label='Confirm Password'
          variant='standard'
          margin='normal'
          type={showNewPassword ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleToggleNewPasswordAgain}>
                    {showNewPasswordAgain ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiInput-underline:after': {
              borderBottomColor: 'orange'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'orange'
            }
          }}
        />

        <Link to={``}>
          <Button fullWidth className='!mt-8' style={{ color: 'white', backgroundColor: 'orange' }}>
            Confirm
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PasswordReset
