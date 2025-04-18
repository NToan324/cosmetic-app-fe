import { HiQrCode } from 'react-icons/hi2'
import { HiOutlineCash } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEY, PAYMENT_METHOD, Role } from '@/consts'
import { formatCurrency } from '@/helpers'
import Cash from './cash'
import { OrderedProductInterface } from '../../Order/order'
import PaymentDialog from './vnpay'
import { User } from '@/services/auth.service'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import orderService from '@/services/order.service'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import customerService, { CustomerInfo } from '@/services/customer.service'

interface CashProps {
  subTotal: number
  pointDiscount: number
  orderedTempProducts: Array<OrderedProductInterface>
  user: User | undefined
  haveCustomer: boolean
}

const DetailPayment = ({ subTotal, pointDiscount, orderedTempProducts, user, haveCustomer }: CashProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>()
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const { reload, setReload } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [orderedInfoUser, setOrderedInfoUser] = useState<CustomerInfo>()
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    const infoUser = localStorage.getItem(LOCAL_STORAGE_KEY.ORDERED_INFO_USER)
    const user = localStorage.getItem(LOCAL_STORAGE_KEY.USER)
    if (user) {
      setOrderedInfoUser(JSON.parse(infoUser || '{}'))
    }
  }, [])

  useEffect(() => {
    const getUsers = async () => {
      if (!orderedInfoUser?.phone) return

      try {
        const response = await customerService.searchCustomer(orderedInfoUser.phone)
        if (response.data && Object.keys(response.data).length > 0) {
          setOrderedInfoUser({
            ...orderedInfoUser,
            _id: response.data._id,
            rank: response.data.customer.rank,
            point: response.data.customer.point
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    getUsers()
  }, [orderedInfoUser?.phone])

  useEffect(() => {
    setTotalAmount(subTotal - pointDiscount)
  }, [subTotal, pointDiscount])

  const handleOpenDialogVnPay = async () => {
    setIsLoading(true)
    //Kiểm tra nếu đã có đơn hàng đang chờ thanh toán
    const pendingOrder = localStorage.getItem(LOCAL_STORAGE_KEY.PENDING_ORDER)
    if (pendingOrder) {
      const pendingOrderData = JSON.parse(pendingOrder)
      if (pendingOrderData.order.order_id && pendingOrderData.order.order_id !== '') {
        setOpen(true)
        setOrderId(pendingOrderData.order.order_id)
        setPaymentMethod(PAYMENT_METHOD.VN_PAY)
        setIsLoading(false)
        return
      }
    }
    //Tạo order
    const items = orderedTempProducts.map((item) => {
      return {
        product_id: item.orderedProduct._id,
        quantity: item.orderedQuantity,
        price: item.orderedProduct.price
      }
    })

    try {
      const { data } = await orderService.createOrder({
        userId: orderedInfoUser?._id || '',
        createdBy: user?.id || '',
        paymentMethod: 'VNPay',
        order: {
          items: items,
          discount_point: pointDiscount
        }
      })

      if (data.order.order_id && data.order.order_id !== '') {
        setOrderId(data.order.order_id)
        setOpen(true)
        setPaymentMethod(PAYMENT_METHOD.VN_PAY)
        localStorage.setItem('pending_order', JSON.stringify(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Tạo đơn hàng thất bại')
      }
    }
    setIsLoading(false)
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
      {haveCustomer && (
        <div className='flex justify-between items-center gap-4 w-full px-4'>
          <span className='text-base text-left'>Điểm cộng sau thanh toán</span>
          <span className='text-base text-green-600 font-medium'>{Math.floor(subTotal * 0.015)} điểm</span>
        </div>
      )}
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full mt-4'>
        <h1 className='text-xl font-bold'>Phương thức thanh toán</h1>
        <div className='flex justify-start items-center gap-4'>
          <button
            className={`${paymentMethod == PAYMENT_METHOD.VN_PAY ? 'bg-primary' : 'bg-white'} relative group flex flex-col justify-center items-center gap-1 w-[85px] h-[65px] rounded-2xl p-1 cursor-pointer transition-all duration-300 ease-in-out ${isLoading ? 'pointer-events-none' : ''}`}
            onClick={() => handleOpenDialogVnPay()}
            disabled={isLoading}
          >
            {isLoading && (
              <div className='bg-black/30 absolute inset-0 flex justify-center items-center rounded-2xl'>
                <CircularProgress
                  size={20}
                  sx={{
                    color: 'black',
                    opacity: 0.8
                  }}
                  className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />
              </div>
            )}
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
          reload={reload}
          setReload={setReload}
        />
      ) : (
        <>
          <PaymentDialog
            open={open}
            onClose={() => setOpen(false)}
            orderedTempProducts={orderedTempProducts}
            pointDiscount={pointDiscount}
            user={user}
            reload={reload}
            setReload={setReload}
            amount={totalAmount}
            orderId={orderId}
          />
        </>
      )}
    </>
  )
}

export default DetailPayment
