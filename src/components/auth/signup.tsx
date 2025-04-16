import { Box, Grid, Typography, TextField, Button, CircularProgress } from '@mui/material'
import Banner from '@/assets/images/login_banner.jpg'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService, { AuthSignUp } from '@/services/auth.service'
import { useState } from 'react'
import { PopupMessage } from '@/components/ui/popup'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AuthSignUp>()

  const [isLoading, setLoading] = useState<boolean>(false)
  const [showPopup, setShowPopup] = useState<boolean>(false)

  const onSubmit: SubmitHandler<AuthSignUp> = async (data) => {
    try {
      setLoading(true)
      const response = await authService.signUp(data)
      if (response.status === 200) {
        setShowPopup(true)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('root', {
          type: 'manual',
          message: error.message
        })
      } else {
        setError('root', {
          type: 'manual',
          message: 'Sign up failed'
        })
      }
    }
    setLoading(false)
  }

  return (
    <div className='!bg-white'>
      {showPopup && <PopupMessage isError={false} />}
      <Grid container sx={{ height: '100vh' }}>
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
            Đăng ký
          </Typography>

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
            Đăng ký tài khoản để trải nghiệm dịch vụ của chúng tôi
          </Typography>

          <Box component='form' noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('phone', {
                required: 'Vui lòng nhập số điện thoại',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits'
                }
              })}
              fullWidth
              label='Số điện thoại'
              variant='standard'
              margin='normal'
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'orange'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'orange'
                }
              }}
            />
            {errors.phone && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.phone.message?.toString()}
              </Typography>
            )}
            <TextField
              {...register('name', {
                required: 'Vui lòng nhập tên'
              })}
              fullWidth
              label='Tên khách hàng'
              variant='standard'
              margin='normal'
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'orange'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'orange'
                }
              }}
            />
            {errors.name && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.name.message?.toString()}
              </Typography>
            )}
            {errors.root?.message && (
              <Typography variant='body2' color='error' textAlign={'start'}>
                {errors.root.message.toString()}
              </Typography>
            )}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Button
                variant='contained'
                sx={{ mt: 2, px: 4, backgroundColor: 'orange', display: 'flex', alignItems: 'center', gap: 2 }}
                type='submit'
                disabled={isLoading}
                className='w-full'
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
                Đăng ký
              </Button>

              <div className='flex justify-start items-center gap-2 mt-4'>
                <span>Bạn đã có tài khoản?</span>
                <Link to='/auth/login'>
                  <span className='text-primary'>Đăng nhập</span>
                </Link>
              </div>
            </Box>
          </Box>
        </Grid>
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

export default SignUp
