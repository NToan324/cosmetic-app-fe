import { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Banner from '@/assets/images/login_banner.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService from '@/services/auth.service'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { Role } from '@/consts'

interface LoginForm {
  identifier: string
  password: string
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()
  const { setUser, user } = useContext(AppContext)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && user && user?.role) {
      const role = user.role

      if (Array.isArray(role) && role.includes(Role.CUSTOMER)) {
        navigate('/home', {
          replace: true,
          state: {
            role: [Role.CUSTOMER]
          }
        })
      } else if (role.includes(Role.MANAGER)) {
        navigate('/admin/dashboard', { replace: true, state: { role: [role] } })
      } else {
        navigate('/home', { replace: true, state: { role: [role] } })
      }
    }
  }, [user, navigate])

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginForm>()

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLogin(true)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)
    const isPhone = /^\d{10,11}$/.test(data.identifier)

    try {
      if (isPhone) {
        const response = await authService.login({
          phone: data.identifier,
          password: data.password
        })
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.accessToken)
          setUser({
            _id: response.data.user._id,
            phone: response.data.user.phone,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            rank: response.data.user.rank,
            point: response.data.user.point
          })
          const roles = response.data.user.role
          if (roles.includes(Role.CUSTOMER)) {
            navigate('/home', {
              state: {
                role: [Role.CUSTOMER]
              }
            })
          }
        }
      } else if (isEmail) {
        const response = await authService.loginWithEmail({
          email: data.identifier,
          password: data.password
        })
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.accessToken)

          setUser({
            _id: response.data.user._id,
            phone: response.data.user.phone,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            type: response.data.user.type
          })
          const roles = response.data.user.role
          if (roles.includes(Role.MANAGER)) {
            navigate('/admin/dashboard', {
              state: {
                role: roles
              }
            })
          } else {
            navigate('/home', {
              state: {
                role: roles
              }
            })
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('UnverifiedAccount')) {
          const findUser = await authService.getUserByEmailOrPhone({
            email: data.identifier
          })
          const userId = findUser.data._id
          const userRole = findUser.data.role

          //sennd otp to email or phone
          await authService.forgotPassword({
            email: data.identifier
          })

          navigate(`/auth/verify?id=${userId}`, {
            state: {
              id: userId,
              active: 'verify',
              role: userRole
            }
          })
        }
        setError('root', {
          type: 'manual',
          message: error.message
        })
      } else {
        setError('root', {
          type: 'manual',
          message: 'Login failed'
        })
      }
    }
    setIsLogin(false)
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
          <div className='flex justify-start items-start gap-2 mb-4 w-full'>
            <Typography variant='h4' gutterBottom sx={{ fontWeight: 600 }}>
              Login
            </Typography>
            {/* <Link to={isClient ? '/auth/employee/login' : '/auth/client/login'}>
              <Button
                variant='outlined'
                color='primary'
                sx={{
                  width: '200px',
                  borderRadius: 2,
                  color: '#ff8108',
                  borderColor: '#ff8108',
                  ':hover': {
                    backgroundColor: '#ffe6ce'
                  }
                }}
              >
                {isClient ? 'Login as Employee' : 'Login as Customer'}
              </Button>
            </Link> */}
          </div>

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
          <Box component='form' noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              // {...register(isClient ? 'phone' : 'email', {
              //   required: isClient ? 'Phone number is required' : 'Email is required',
              //   validate: !isClient
              //     ? (value) => {
              //         const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              //         return regex.test(value || '') || 'Invalid email address'
              //       }
              //     : undefined,
              //   minLength: isClient
              //     ? {
              //         value: 10,
              //         message: 'Phone number must be at least 10 characters'
              //       }
              //     : undefined
              // })}
              {...register('identifier', {})}
              fullWidth
              label={`Phone number or email`}
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
            {errors.identifier && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.identifier.message}
              </Typography>
            )}
            <TextField
              {...register('password', {
                required: 'Password is required'
              })}
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
            {errors.password && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.password.message}
              </Typography>
            )}
            {errors.root?.message && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.root.message.toString()}
              </Typography>
            )}
            <div className='w-full flex justify-end'>
              <Link to={'/auth/forgot-password'} className='text-gray-400 text-right'>
                Forgot password?
              </Link>
            </div>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Button
                type='submit'
                variant='contained'
                sx={{ mt: 2, px: 4, backgroundColor: 'orange' }}
                disabled={isLogin}
              >
                Login
              </Button>

              <div className='flex justify-start items-center gap-2 mt-4'>
                <span>Don't have an account?</span>
                <Link to='/auth/signup' className='text-primary'>
                  Sign up
                </Link>
              </div>
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
