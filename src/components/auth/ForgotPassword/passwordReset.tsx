import { useState } from 'react'
import { Avatar, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { TbLockPassword } from 'react-icons/tb'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { useLocation, useNavigate } from 'react-router-dom'
import authService from '@/services/auth.service'

const PasswordReset = () => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const { active = 'reset', id } = location.state || {}

  const handleToggleNewPassword = () => setShowNewPassword((prev) => !prev)
  const handleToggleNewPasswordAgain = () => setShowNewPasswordAgain((prev) => !prev)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    if (!password || !confirmPassword) {
      setError('Please enter both password fields')
      setIsLoading(false)

      return
    }

    if (id === undefined) {
      setError('Verification failed. Please try again from the beginning.')
      setIsLoading(false)

      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)

      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await authService.resetPassword({ password, id })
      navigate('/auth/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to reset password')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-50'>
      <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
        <div className='flex flex-col items-center mb-6'>
          <Avatar sx={{ width: 80, height: 80, mt: 4, mb: 6 }} style={{ backgroundColor: '#ff8108' }}>
            <TbLockPassword style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className='text-2xl font-bold'>{active === 'reset' ? 'Tạo lại mật khẩu mới' : 'Thay đổi mật khẩu'}</h1>
          <p className='text-gray-600 mt-2 text-center'>
            {active === 'reset'
              ? 'Vui lòng nhập mật khẩu mới để tạo lại mật khẩu'
              : 'Đây là lần đầu tiên bạn đăng nhập, vui lòng thay đổi mật khẩu'}
          </p>
        </div>

        <TextField
          fullWidth
          label='Mật khẩu mới'
          variant='standard'
          margin='normal'
          type={showNewPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleToggleNewPassword}>
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiInput-underline:after': { borderBottomColor: 'orange' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'orange' }
          }}
        />

        <TextField
          fullWidth
          label='Nhập lại mật khẩu mới'
          variant='standard'
          margin='normal'
          type={showNewPasswordAgain ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleToggleNewPasswordAgain}>
                  {showNewPasswordAgain ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiInput-underline:after': { borderBottomColor: 'orange' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'orange' }
          }}
        />

        {error && (
          <Typography variant='body2' color='error' className='text-start' mt={2}>
            {error}
          </Typography>
        )}

        <Button
          disabled={isLoading}
          fullWidth
          className='!mt-8'
          style={{
            color: 'white',
            backgroundColor: 'orange',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'center'
          }}
          onClick={handleSubmit}
        >
          {isLoading && (
            <CircularProgress
              size={20}
              sx={{
                color: 'black',
                opacity: 0.2,
                mr: 1
              }}
            />
          )}
          {active === 'reset' ? 'Tạo lại mật khẩu' : 'Thay đổi mật khẩu'}
        </Button>
      </div>
    </div>
  )
}

export default PasswordReset
