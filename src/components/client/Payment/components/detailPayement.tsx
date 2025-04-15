import { HiQrCode } from 'react-icons/hi2'
import { HiOutlineCash } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { PAYMENT_METHOD, Role } from '@/consts'
import { formatCurrency } from '@/helpers'
import Cash from './cash'
import { OrderedProductInterface } from '../../Order/order'
import PaymentDialog from './vnpay'
import { User } from '@/services/auth.service'

interface CashProps {
  subTotal: number
  pointDiscount: number
  orderedTempProducts: Array<OrderedProductInterface>
  user: User | undefined
}

const DetailPayment = ({ subTotal, pointDiscount, orderedTempProducts, user }: CashProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>()
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTotalAmount(subTotal - pointDiscount)
  }, [subTotal, pointDiscount])

  const handleOpenDialogVnPay = () => {
    setOpen(true)
    setPaymentMethod(PAYMENT_METHOD.VN_PAY)
  }

  return (
    <>
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full'>
        <h1 className='text-xl font-bold'>Chi tiết thanh toán</h1>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Tạm tính</span>
          <span className='text-base'>{formatCurrency(subTotal)}</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Giảm giá</span>
          <span className='text-base'>{formatCurrency(Number(pointDiscount))}</span>
        </div>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Tổng cộng</span>
          <span className='text-base'>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
      <div className='flex justify-between items-center gap-4 w-full px-4'>
        <span className='text-base text-left'>Điểm cộng sau thanh toán</span>
        <span className='text-base text-green-600 font-medium'>{Math.floor(totalAmount * 0.01)} điểm</span>
      </div>
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full mt-4'>
        <h1 className='text-xl font-bold'>Phương thức thanh toán</h1>
        <div className='flex justify-start items-center gap-4'>
          <button
            className={`${paymentMethod == PAYMENT_METHOD.VN_PAY ? 'bg-primary' : 'bg-white'} group flex flex-col justify-center items-center gap-1 w-[85px] h-[65px] rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-in-out`}
            onClick={() => handleOpenDialogVnPay()}
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
          {user && !user.role.includes(Role.CUSTOMER) && (
            <button
              className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'bg-primary' : 'bg-white'} group flex flex-col justify-center items-center gap-1 w-[85px] h-[65px] rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-in-out`}
              onClick={() => setPaymentMethod(PAYMENT_METHOD.CASH)}
            >
              <HiOutlineCash
                size={25}
                className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'text-white' : 'group-hover:text-[#ff8108]'} text-2xl`}
              />
              <span
                className={`${paymentMethod == PAYMENT_METHOD.CASH ? 'text-white' : 'group-hover:text-[#ff8108]'} text-base font-sans`}
              >
                Tiền mặt
              </span>
            </button>
          )}
        </div>
      </div>
      {paymentMethod == PAYMENT_METHOD.CASH ? (
        <Cash
          amount={totalAmount}
          orderedTempProducts={orderedTempProducts}
          pointDiscount={pointDiscount}
          user={user}
        />
      ) : (
        <>
          <PaymentDialog
            open={open}
            onClose={() => setOpen(false)}
            amount={totalAmount}
            orderedTempProducts={orderedTempProducts}
            pointDiscount={pointDiscount}
          />
        </>
      )}
    </>
  )
}

export default DetailPayment
