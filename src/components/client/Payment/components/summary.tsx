import { HiQrCode } from 'react-icons/hi2'
import { HiOutlineCash } from 'react-icons/hi'
import { useState } from 'react'
import { PAYMENT_METHOD } from '@/consts'
import Cash from '@/components/client/Payment/components/cash'
const Summary = () => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH)
  return (
    <div className='flex flex-col justify-start items-start gap-4 p-5'>
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full'>
        <h1 className='text-xl font-bold'>Payment Summary</h1>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Sub total</span>
          <span className='text-base'>1,344,000đ</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Discount -10%</span>
          <span className='text-base'>1,344,000đ</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Temporarily</span>
          <span className='text-base'>1,344,000đ</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>VAT (8%)</span>
          <span className='text-base'>1,344,000đ</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Total</span>
          <span className='text-base'>1,344,000đ</span>
        </div>
      </div>
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full mt-4'>
        <h1 className='text-xl font-bold'>Payment Method</h1>
        <div className='flex justify-start items-center gap-4'>
          <button
            className={`${paymentMethod == PAYMENT_METHOD.VN_PAY ? 'bg-primary' : 'bg-white'} group flex flex-col justify-center items-center gap-1 w-[80px] h-[60px] rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-in-out`}
            onClick={() => setPaymentMethod(PAYMENT_METHOD.VN_PAY)}
          >
            <HiQrCode
              size={25}
              className={`${paymentMethod == PAYMENT_METHOD.VN_PAY ? 'text-white' : 'group-hover:text-[#ff8108]'} text-2xl`}
            />
            <span
              className={`${paymentMethod == PAYMENT_METHOD.VN_PAY ? 'text-white' : 'group-hover:text-[#ff8108]'} text-base font-sans`}
            >
              VN Pay
            </span>
          </button>
          <button
            className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'bg-primary' : 'bg-white'} group flex flex-col justify-center items-center gap-1 w-[80px] h-[60px] rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-in-out`}
            onClick={() => setPaymentMethod(PAYMENT_METHOD.CASH)}
          >
            <HiOutlineCash
              size={25}
              className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'text-white' : 'group-hover:text-[#ff8108]'} text-2xl`}
            />
            <span
              className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'text-white' : 'group-hover:text-[#ff8108]'} text-base font-sans`}
            >
              Cash
            </span>
          </button>
        </div>
      </div>
      {paymentMethod == PAYMENT_METHOD.CASH && <Cash />}
    </div>
  )
}

export default Summary
