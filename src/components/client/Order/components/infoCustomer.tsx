import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import customerService from '@/services/customer.service'
import OrderHistoryDialog, { Order } from './dialogViewHistory'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService from '@/services/auth.service'
import { toast } from 'react-toastify'
interface Customer {
  phoneNumber: string
  name: string
}
const InfoCustomer = () => {
  const navigate = useNavigate()
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    getValues,
    watch
  } = useForm<Customer>()
  const phoneNumber = watch('phoneNumber')

  useEffect(() => {
    const handleSearchCustomer = async () => {
      const storedUser = localStorage.getItem('ordered_info_user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setValue('phoneNumber', user.phoneNumber)
        setValue('name', user.name)
      } else {
        if (phoneNumber && phoneNumber.length === 10) {
          const response = await customerService.searchCustomer(phoneNumber)
          if (response.data) {
            setValue('name', response.data.name || 'KH' + phoneNumber.slice(phoneNumber.length - 4, phoneNumber.length))
          }
        } else if (phoneNumber && phoneNumber.length < 10) {
          setValue('name', '')
        }
      }
    }
    handleSearchCustomer()
  }, [phoneNumber, setValue])

  const createNewCustomer: SubmitHandler<Customer> = async (data) => {
    try {
      await authService.signUp({
        phone: data.phoneNumber,
        name: data.name
      })
      toast.success('Tạo khách hàng thành công')
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Tạo khách hàng thất bại')
        setError('root', {
          type: 'server',
          message: error.message
        })
      } else {
        setError('root', {
          type: 'server',
          message: 'Tạo khách hàng thất bại, vui lòng thử lại sau'
        })
      }
    }
  }

  const viewHistory: SubmitHandler<Customer> = async (data) => {
    console.log('data', data)
    setOpenHistoryDialog(true)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('ordered_info_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setValue('phoneNumber', user.phoneNumber)
      setValue('name', user.name)
    }
  }, [setValue])

  const handleNextStep = () => {
    if (phoneNumber.length === 10 && getValues('name')) {
      localStorage.setItem(
        'ordered_info_user',
        JSON.stringify({
          phoneNumber: getValues('phoneNumber'),
          name: getValues('name')
        })
      )
    }
    navigate('/order/payment')
  }

  const dummyOrders: Order[] = [
    {
      id: '1',
      code: 'ORD001',
      customerName: 'Nguyễn Văn A',
      totalAmount: 1200000,
      status: 'Đã giao',
      createdAt: '2024-04-10'
    }
    // ...thêm đơn hàng khác
  ]

  return (
    <div className='flex flex-col justify-start items-start gap-4 bg-white'>
      <h1 className='text-2xl font-bold'>Khách hàng</h1>
      <label htmlFor='phoneNumber'>Số điện thoại</label>
      <input
        {...register('phoneNumber', {
          required: 'Vui lòng nhập số điện thoại',
          pattern: {
            value: /^\d{10}$/,
            message: 'Số điện thoại không hợp lệ'
          }
        })}
        type='text'
        placeholder='Vui lòng nhập số điện thoại'
        className='border-none outline-none rounded-2xl w-full bg-gray-100 p-4'
      />
      {errors.phoneNumber && <div className='text-red-500 text-start text-sm'>{errors.phoneNumber.message}</div>}
      <label htmlFor='phoneNumber'>Tên khách hàng</label>
      <input
        {...register('name', {
          required: 'Vui lòng nhập tên khách hàng'
        })}
        type='text'
        placeholder='Vui lòng nhập tên khách hàng'
        className='border-none outline-none rounded-2xl w-full bg-gray-100 p-4'
      />
      {errors.name && <div className='text-red-500 text-start text-sm'>{errors.name.message}</div>}
      {errors.root && <div className='text-red-500 text-start text-sm'>{errors.root.message}</div>}

      <div className='flex justify-start items-center gap-2'>
        <button
          type='button'
          className='px-4 py-2 border border-primary text-primary rounded-xl cursor-pointer'
          onClick={handleSubmit(createNewCustomer)}
        >
          Tạo thành viên
        </button>

        <button
          type='button'
          className='px-4 py-2 border border-primary text-primary rounded-xl cursor-pointer'
          onClick={handleSubmit(viewHistory)}
        >
          Xem lịch sử đơn hàng
        </button>
      </div>
      <button
        className='px-4 py-2 bg-primary text-white rounded-xl w-full cursor-pointer'
        onClick={() => handleNextStep()}
      >
        Tiếp tục thanh toán
      </button>
      <OrderHistoryDialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} orders={dummyOrders} />
    </div>
  )
}

export default InfoCustomer
