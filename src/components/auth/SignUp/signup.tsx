import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import Banner from '@/assets/images/login_banner.jpg'
import { NavLink } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService, { AuthSignUp } from '@/services/auth'
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
            Sign Up
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
            Sign up to become our members and receive incentives.
          </Typography>

          <Box component='form' noValidate sx={{ width: '100%', maxWidth: 400 }} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits'
                }
              })}
              fullWidth
              label='Phone Number'
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
                required: 'Name is required'
              })}
              fullWidth
              label='Name'
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
                sx={{ mt: 2, px: 4, backgroundColor: 'orange' }}
                type='submit'
                disabled={isLoading}
              >
                Sign Up
              </Button>

              <div className='flex justify-start items-center gap-2 mt-4'>
                <span>Have an account?</span>
                <NavLink to='/login' className='text-primary'>
                  Login
                </NavLink>
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
