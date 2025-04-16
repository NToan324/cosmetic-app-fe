import { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment, CircularProgress } from '@mui/material'
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
  const { setUser, user, setReload, reload } = useContext(AppContext)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && user && user?.role) {
      const role = user.role

      setReload(!reload)
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
          localStorage.setItem('user', JSON.stringify(response.data.user))
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
            setReload(!reload)
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
          localStorage.setItem('user', JSON.stringify(response.data.user))
          setUser({
            _id: response.data.user._id,
            phone: response.data.user.phone,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            type: response.data.user.type
          })
          const roles = response.data.user.role
          setReload(!reload)
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
          <div className='flex justify-center items-start gap-2 mb-4'>
            <Typography variant='h4' gutterBottom sx={{ fontWeight: 600 }}>
              Đăng nhập
            </Typography>
          </div>

          <Typography
            variant='body1'
            sx={{
              mb: 2,
              color: 'text.secondary',
              width: '50%',
              textAlign: { xs: 'center', md: 'left' }
            }}
            className='md:block hidden'
          >
            Vui lòng nhập thông tin tài khoản của bạn để đăng nhập vào hệ thống
          </Typography>
          <Box component='form' noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('identifier', {})}
              fullWidth
              label={`Số điện thoại hoặc email`}
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
              label='Mật khẩu'
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
                Quên mật khẩu?
              </Link>
            </div>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Button
                type='submit'
                variant='contained'
                sx={{ mt: 2, px: 4, backgroundColor: 'orange', display: 'flex', alignItems: 'center', gap: 2 }}
                disabled={isLogin}
                className='w-full'
              >
                {isLogin && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: 'black',
                      opacity: 0.2
                    }}
                  />
                )}
                Đăng nhập
              </Button>

              <div className='flex justify-start items-center gap-2 mt-4'>
                <span>Bạn chưa có tài khoản?</span>
                <Link to='/auth/signup'>
                  <span className='text-primary'>Đăng ký</span>
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
