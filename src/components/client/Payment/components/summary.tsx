import { useEffect, useState } from 'react'
import { OrderedProductInterface } from '../../Order/order'
import { formatCurrency } from '@/helpers'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DetailPayment from './detailPayement'

interface SummaryProps {
  orderedTempProducts: Array<OrderedProductInterface>
}

const Summary = ({ orderedTempProducts }: SummaryProps) => {
  const [subTotal, setSubTotal] = useState(0)
  const [totalPoint, setTotalPoint] = useState(2000)
  const [pointDiscount, setPointDiscount] = useState(0)
  const [isApplyPoint, setIsApplyPoint] = useState(false)
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<{ point: number }>({
    mode: 'onChange'
  })
  const point = watch('point')

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
    setSubTotal((prev) => prev - Number(point))
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
      <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full'>
        <h1 className='text-xl font-bold'>Điểm tích lũy</h1>
        <div className='flex justify-between items-center gap-4 w-full'>
          <span className='text-base'>Tổng điểm hiện tại</span>
          <span className='text-base'>{totalPoint} điểm</span>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <input
            {...register('point', {
              max: {
                value: 2000,
                message: 'Không được nhập quá 2000 điểm'
              },
              min: {
                value: 0,
                message: 'Điểm không được âm'
              }
            })}
            max={2000}
            type='number'
            placeholder='Nhập số điểm'
            disabled={isApplyPoint}
            className='p-2 rounded-xl bg-white border border-gray-300 w-full outline-none'
          />
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
        {errors.point && <div className='text-red-500 text-start text-sm'>{errors.point.message}</div>}
        {point && point > 0 && !errors.point && (
          <p className='text-justify text-red-500 text-sm'>
            Bạn đã giảm được {formatCurrency(Number(point))} cho đơn hàng này
          </p>
        )}

        <p className='text-justify text-red-500 text-sm'>
          Điểm tích lũy có thể được dùng để giảm giá đơn hàng (1.000 điểm = 1.000đ), nhưng chỉ tối đa 10% tổng giá trị
          đơn hàng.
        </p>
      </div>
      <DetailPayment subTotal={subTotal} pointDiscount={pointDiscount} />
    </div>
  )
}

export default Summary
