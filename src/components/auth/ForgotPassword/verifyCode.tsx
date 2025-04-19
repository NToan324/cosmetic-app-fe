import { useState, useRef, useEffect } from 'react'
import { Avatar, Button, CircularProgress } from '@mui/material'
import { CiLock } from 'react-icons/ci'
import { useLocation, useNavigate } from 'react-router-dom'
import authService from '@/services/auth.service'

const VerifyCode = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const inputsRef = useRef<HTMLInputElement[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const { id, active } = location.state || {}

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimeLeft(60)
    inputsRef.current[0]?.focus()
    try {
      await authService.resendCode(id)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to resend code')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    const otp_code = otp.join('')
    if (!id) {
      setError('Verification failed. Please try again from the beginning.')
      setIsLoading(false)
      return
    }

    try {
      const res = await authService.verifyCode({ otp_code, id: id })
      if (res.status === 200) {
        if (active === 'verify') {
          navigate('/auth/password-reset', {
            state: { active: 'verify', id },
            replace: true
          })
        } else {
          navigate('/auth/password-reset', {
            state: { active: 'reset', id },
            replace: true
          })
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to verify code')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
    setIsLoading(false)
  }

  const charactersLeft = 6 - otp.filter((d) => d !== '').length
  const isFull = charactersLeft === 0

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-50'>
      <div className='bg-white rounded-lg shadow p-8 w-full max-w-sm'>
        <div className='flex flex-col items-center mb-6'>
          <Avatar sx={{ backgroundColor: '#ff8108', width: 100, height: 100, mb: 4 }}>
            <CiLock style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className='text-2xl font-bold'>Xác thực</h1>
          <p className='text-gray-600 mt-2 text-center'>Vui lòng nhập mã xác thực được gửi đến</p>
        </div>

        <div className='flex justify-center gap-2 mb-4'>
          {otp.map((value, index) => (
            <input
              key={index}
              type='text'
              maxLength={1}
              value={value}
              ref={(el) => {
                inputsRef.current[index] = el!
              }}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-10 h-10 text-center border-b-2 border-gray-300 text-xl focus:outline-none'
            />
          ))}
        </div>

        {error && <p className='text-red-500 text-sm text-center mb-2'>{error}</p>}

        <Button
          variant='contained'
          color='primary'
          sx={{ backgroundColor: '#FF8C00' }}
          className='flex justify-center items-center gap-2'
          fullWidth
          disabled={!isFull || isLoading}
          onClick={handleVerify}
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
          {isFull ? 'Xác thực' : `${charactersLeft} ký tự còn lại`}
        </Button>

        {timeLeft > 0 ? (
          <p className='text-gray-500 text-sm mt-4'>Resend code in {timeLeft}s</p>
        ) : (
          <span className={`text-primary block mt-4 cursor-pointer text-base`} onClick={handleResend}>
            Gửi lại mã xác thực
          </span>
        )}
      </div>
    </div>
  )
}

export default VerifyCode
