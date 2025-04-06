import { useState } from 'react'
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Banner from '@/assets/images/login_banner.jpg'
import { Link, useLocation } from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const location = useLocation()
  const isClient = location.pathname.includes('client')

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className='!bg-white'>
      <Grid container sx={{ height: '100vh' }}>
        {/* Bên trái: Form đăng nhập */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            p: { xs: 4, md: 12 }
          }}
        >
          <Typography
            variant='h4'
            gutterBottom
            sx={{ width: '100%', textAlign: { xs: 'center', md: 'left' }, fontWeight: 600 }}
          >
            Login
          </Typography>

          <Typography
            variant='body1'
            sx={{
              mb: 2,
              color: 'text.secondary',
              width: '100%',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Access your account by signing in below
          </Typography>

          <Box component='form' noValidate sx={{ width: '100%', maxWidth: 400 }}>
            <TextField
              fullWidth
              label={`${isClient ? 'Phone Number' : 'Email'}`}
              variant='standard'
              margin='normal'
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'orange' // Màu cam khi focus
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'orange' // Màu chữ của label khi focus
                }
              }}
            />
            <TextField
              fullWidth
              label='Password'
              variant='standard'
              margin='normal'
              type={showPassword ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleTogglePassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'orange' // Màu cam khi focus
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'orange' // Màu chữ của label khi focus
                }
              }}
            />
            <div className='w-full flex justify-end'>
              <Link
                to={'/auth/forgot-password'}
                state={{
                  role: isClient ? 'client' : 'employee'
                }}
                className='text-gray-400 text-right'
              >
                Forgot password?
              </Link>
            </div>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Button variant='contained' sx={{ mt: 2, px: 4, backgroundColor: 'orange' }}>
                Login
              </Button>
              {isClient && (
                <div className='flex justify-start items-center gap-2 mt-4'>
                  <span>Don't have an account?</span>
                  <Link to='/auth/client/signup' className='text-primary'>
                    Sign up
                  </Link>
                </div>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Bên phải: Hình minh họa/biểu đồ */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },

              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: 2
            }}
          >
            <img
              src={Banner}
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: '@assets/images/login_banner.jpg',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 2
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
