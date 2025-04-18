import { useEffect, useState } from 'react'
import { OrderedProductInterface } from '../../Order/order'
import { formatCurrency } from '@/helpers'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DetailPayment from './detailPayement'
import { Role } from '@/consts'
import { User } from '@/services/auth.service'

interface SummaryProps {
  orderedTempProducts: Array<OrderedProductInterface>
}

const Summary = ({ orderedTempProducts }: SummaryProps) => {
  const [subTotal, setSubTotal] = useState(0)
  const [totalPoint, setTotalPoint] = useState(0)
  const [pointDiscount, setPointDiscount] = useState(0)
  const [isApplyPoint, setIsApplyPoint] = useState(false)
  const [haveCustomer, setHaveCustomer] = useState(false)
  const [user, setUser] = useState<User>()
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<{ point: number }>({
    mode: 'onChange'
  })
  const point = watch('point')

  useEffect(() => {
    const storedUserRaw = localStorage.getItem('user')
    const storedOrderedUserRaw = localStorage.getItem('ordered_info_user')

    if (storedUserRaw) {
      const parsedUser = JSON.parse(storedUserRaw)
      setUser(parsedUser)

      if (storedOrderedUserRaw) {
        const parsedOrderedUser = JSON.parse(storedOrderedUserRaw)

        // Nếu là khách hàng và trùng số điện thoại
        if (parsedUser.role?.includes(Role.CUSTOMER) && parsedUser.phone === parsedOrderedUser.phone) {
          setTotalPoint(parsedOrderedUser.customer?.point || 0)
          setHaveCustomer(true)
        } else if (!parsedUser.role?.includes(Role.CUSTOMER)) {
          // Nếu là nhân viên hoặc người khác
          setTotalPoint(parsedOrderedUser.customer?.point || 0)
          setHaveCustomer(true)
        } else {
          setHaveCustomer(false)
        }
      }
    }
  }, [])

  useEffect(() => {
    const calculateTotalPrice = () => {
      let totalPrice = 0
      orderedTempProducts.forEach((item) => {
        totalPrice += item.orderedProduct.price * item.orderedQuantity
      })
      setSubTotal(totalPrice)
    }
    calculateTotalPrice()
  }, [orderedTempProducts])

  const handleApplyPoint = () => {
    setIsApplyPoint(true)
    setTotalPoint((prev) => prev - Number(point))
    setPointDiscount((prev) => prev + Number(point))
    toast.success('Đã giảm ' + formatCurrency(Number(point)) + ' cho đơn hàng này')
  }
  const handleDeletePoint = () => {
    setIsApplyPoint(false)
    setSubTotal((prev) => prev + Number(point))
    setTotalPoint((prev) => prev + Number(point))
    setPointDiscount(0)
  }

  return (
    <div className='flex flex-col justify-start items-start gap-4 p-5'>
      {haveCustomer && (
        <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full'>
          <h1 className='text-xl font-bold'>Điểm tích lũy</h1>
          <div className='flex justify-between items-center gap-4 w-full'>
            <span className='text-base text-left'>Tổng điểm hiện tại</span>
            <span className='text-base text-right'>{totalPoint} điểm</span>
          </div>
          <div className='flex flex-wrap items-center gap-2 w-full'>
            <input
              {...register('point', {
                max: {
                  value: totalPoint,
                  message: `Không được nhập quá ${totalPoint} điểm`
                },
                min: {
                  value: 0,
                  message: 'Điểm không được âm'
                }
              })}
              max={point}
              type='number'
              placeholder='Nhập số điểm'
              disabled={isApplyPoint}
              className='p-2 rounded-xl bg-white border border-gray-300 w-full outline-none'
            />
            <div className='flex justify-center items-center gap-4'>
              <button
                disabled={point ? Number(point) > totalPoint || Number(point) < 0 || isApplyPoint : false}
                onClick={() => {
                  handleApplyPoint()
                }}
                type='button'
                className={
                  'px-4 py-2 bg-primary text-white rounded-xl whitespace-nowrap cursor-pointer' +
                  (point
                    ? Number(point) > totalPoint || Number(point) < 0 || isApplyPoint
                      ? ' opacity-50 cursor-not-allowed'
                      : ''
                    : '')
                }
              >
                Áp dụng
              </button>
              <button
                disabled={!isApplyPoint}
                onClick={() => {
                  handleDeletePoint()
                }}
                type='button'
                className={
                  'px-4 py-2 bg-red-600 text-white rounded-xl whitespace-nowrap cursor-pointer' +
                  (!isApplyPoint ? ' opacity-50 cursor-not-allowed' : '')
                }
              >
                Xóa điểm
              </button>
            </div>
          </div>
          {errors.point && <div className='text-red-500 text-start text-sm'>{errors.point.message}</div>}
          {point && point > 0 && !errors.point && (
            <p className='text-justify text-red-500 text-sm'>
              Bạn đã giảm được {formatCurrency(Number(point))} cho đơn hàng này
            </p>
          )}

          <p className='text-justify text-red-500 text-sm'>
            Điểm tích lũy có thể được dùng để giảm giá đơn hàng (1.000 điểm = 1.000đ)
          </p>
        </div>
      )}

      <DetailPayment
        user={user}
        subTotal={subTotal}
        pointDiscount={pointDiscount}
        orderedTempProducts={orderedTempProducts}
        haveCustomer={haveCustomer}
      />
    </div>
  )
}

export default Summary
