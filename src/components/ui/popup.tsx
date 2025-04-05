import Lottie from 'lottie-react'
import AnimationSuccess from '@/assets/images/AnimationSuccess.json'
import AnimationError from '@/assets/images/AnimationError.json'
import { motion } from 'framer-motion'
import { FadeZoom } from '@/motion/variants'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface PopupMessageProps {
  isError: boolean
}

export const PopupMessage = ({ isError }: PopupMessageProps) => {
  const [timing, setTimming] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    if (timing > 0) {
      const timer = setTimeout(() => {
        setTimming((prev: number) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      navigate('/auth/client/login')
    }
  }, [timing, navigate])

  const handleRedirect = () => {
    navigate('/auth/client/login')
  }
  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center transition-all duration-200 ease-in-out'>
      <motion.div
        variants={FadeZoom({
          direction: 'up',
          zoom: 0.5,
          duration: 1.5
        })}
        initial='hidden'
        animate='visible'
        exit={{ opacity: 0 }}
        className='border border-white rounded-2xl w-[300px] h-[250px] bg-white/10 backdrop-blur-2xl'
      >
        <Lottie
          animationData={isError ? AnimationError : AnimationSuccess}
          className={`${isError ? 'scale-75 -top-[50px]' : ' -top-[80px]'} absolute left-0 right-0`}
        />
        <motion.div
          variants={FadeZoom({
            direction: 'up',
            duration: 1.5,
            delay: 0.5
          })}
          initial='hidden'
          animate='visible'
          className={`${isError ? 'bottom-[0px]' : 'bottom-[5px]'} absolute p-4 right-0 left-0`}
        >
          <h2 className={`${isError ? 'text-base' : 'text-2xl'} font-bold text-center mt-10 text-white`}>
            {isError ? 'Oops! Something went wrong. Create account is failed!' : 'Create a successful account!'}
          </h2>
          {/* Redirecting Login */}
          <p className='text-sm text-center text-white mt-2'>
            Redirecting to{' '}
            <span className='text-primary cursor-pointer' onClick={handleRedirect}>
              Login
            </span>{' '}
            page in {timing} seconds
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
