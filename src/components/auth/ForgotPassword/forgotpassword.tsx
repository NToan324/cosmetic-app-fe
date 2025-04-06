import { Avatar, TextField } from '@mui/material'
import { useLocation, Link } from 'react-router-dom'
import { MdOutlineMail } from 'react-icons/md'
import { FaPhone } from 'react-icons/fa6'

const ForgotPassword = () => {
  const location = useLocation()
  const { role } = location.state || { role: 'client' }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-50'>
      <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
        {/* Header */}
        <div className='flex flex-col items-center mb-4'>
          <Avatar sx={{ width: 100, height: 100, mt: 4, mb: 6 }} style={{ backgroundColor: 'orange' }}>
            {role === 'client' ? <FaPhone style={{ fontSize: 46 }} /> : <MdOutlineMail style={{ fontSize: 46 }} />}
          </Avatar>
          <h1 className='text-2xl font-b'>Forgot Password</h1>
          <p className='text-gray-600 mt-2 text-center'>
            {`Enter your ${role === 'client' ? 'phone number' : 'email'} to retrieve your old password`}
          </p>
        </div>

        {/*  Password */}
        <TextField
          fullWidth
          label={`${role === 'client' ? 'Phone number' : 'Email'}`}
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
        <Link to='/auth/verify' className='block mt-4 text-white bg-primary rounded-xl px-4 py-2'>
          Send Code
        </Link>
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
