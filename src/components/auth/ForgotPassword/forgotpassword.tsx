import { Avatar, TextField } from '@mui/material'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { MdOutlineMail } from 'react-icons/md'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService from '@/services/auth'

// to='/auth/verify
const ForgotPassword = () => {
  const location = useLocation()
  const { role } = location.state || { role: 'client' }
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<{ phoneOrEmail: string }>()

  const onSubmit: SubmitHandler<{ phoneOrEmail: string }> = async (data) => {
    try {
      const value = data.phoneOrEmail.trim()

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      const isPhone = /^\d{10,11}$/.test(value)

      if (!isEmail && !isPhone) {
        setError('phoneOrEmail', {
          type: 'manual',
          message: 'Invalid phone number or email format'
        })
        return
      }

      const payload = isEmail ? { email: value } : { phone: value }

      // Gửi API forgot password
      const response = await authService.forgotPassword(payload)

      // Điều hướng đến trang verify
      navigate(`/auth/verify?id=${response.data.user_id}`, {
        state: { id: response.data.user_id }
      })
    } catch (error) {
      if (error instanceof Error) {
        setError('phoneOrEmail', {
          type: 'manual',
          message: error.message || 'Failed to send code. Please try again.'
        })
      } else {
        setError('phoneOrEmail', {
          type: 'manual',
          message: 'An unexpected error occurred. Please try again.'
        })
      }
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-50'>
      <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
        {/* Header */}
        <div className='flex flex-col items-center mb-4'>
          <Avatar sx={{ width: 100, height: 100, mt: 4, mb: 6 }} style={{ backgroundColor: 'orange' }}>
            <MdOutlineMail style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className='text-2xl font-b'>Forgot Password</h1>
          <p className='text-gray-600 mt-2 text-center'>
            {`Enter your phone number or email to retrieve your password`}
          </p>
        </div>

        {/*  Password */}
        <form action='' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('phoneOrEmail', {
              required: 'Please enter your phone number or email'
            })}
            fullWidth
            label='Phone number or email'
            variant='standard'
            margin='normal'
            type='text'
            sx={{
              '& .MuiInput-underline:after': {
                borderBottomColor: 'orange'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'orange'
              }
            }}
          />
          {errors.phoneOrEmail && <p className='text-red-500 text-sm mt-1 text-start'>{errors.phoneOrEmail.message}</p>}

          <button
            type='submit'
            className='w-full block mt-4 text-white bg-primary rounded-xl px-4 py-2 text-center cursor-pointer'
          >
            Send code
          </button>
        </form>
        <div style={{ width: '100%', textAlign: 'left', marginTop: '12px' }}>
          <Link
            to={`${role === 'client' ? '/auth/client/login' : '/auth/employee/login'}`}
            className='!mt-8 text-primary'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
