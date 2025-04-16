import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import customerService from '@/services/customer.service'
import OrderHistoryDialog, { Order } from './dialogViewHistory'
import { useForm, SubmitHandler } from 'react-hook-form'
import authService, { User } from '@/services/auth.service'
import { toast } from 'react-toastify'
import { OrderedProductInterface } from '../order'
import { Role } from '@/consts'

interface CustomerInterface {
  phone: string
  name: string
}

interface InfoCustomerProps {
  orderedTempProduct: Array<OrderedProductInterface>
  user?: User | null
}

const InfoCustomer = ({ orderedTempProduct, user }: InfoCustomerProps) => {
  const navigate = useNavigate()
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false)
  const [customer, setCustomer] = useState<{ _id: string; rank: string; point: number }>()
  const [notify, setNotify] = useState<string>('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    getValues,
    watch
  } = useForm<CustomerInterface>()

  const loadedFromStorage = useRef(false)
  const loadedFromUser = useRef(false)
  const phone = watch('phone')
  const name = watch('name')

  useEffect(() => {
    const storedUser = localStorage.getItem('ordered_info_user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setValue('phone', parsed.phone)
      setValue('name', parsed.name)
      setCustomer(parsed.customer)
      loadedFromStorage.current = true
    } else if (user) {
      if (user.role.includes(Role.CUSTOMER)) {
        setValue('phone', user.phone)
        setValue('name', user.name)
        loadedFromUser.current = true
      }
    }
  }, [user, setValue])

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!phone || phone.length !== 10) {
        setCustomer(undefined)
        return
      }

      try {
        const response = await customerService.searchCustomer(phone)
        if (response.data && Object.keys(response.data).length > 0) {
          setCustomer({
            _id: response.data._id,
            rank: response.data.customer.rank,
            point: response.data.customer.point
          })
          if (user && user.role.includes(Role.CUSTOMER)) {
            if (response.data.phone !== user.phone) {
              setNotify(
                'Bạn sẽ không thể tích điểm cho đơn hàng này vì số điện thoại không trùng khớp với tài khoản của bạn'
              )
            } else {
              setNotify('')
            }
          } else if (user && !user.role.includes(Role.CUSTOMER)) {
            setNotify('')
          } else {
            setNotify('Bạn có muốn đăng nhập để tích điểm?')
          }

          if (!name || loadedFromStorage.current || loadedFromUser.current) {
            setValue('name', response.data.name || 'KH' + phone.slice(-4))
          }
        } else {
          if (user && user.role.includes(Role.CUSTOMER)) {
            setNotify(
              'Bạn sẽ không thể tích điểm cho đơn hàng này vì số điện thoại không trùng khớp với tài khoản của bạn'
            )
          } else {
            setNotify('Khách hàng mới')
          }
          // setValue('name', 'KH' + phone.slice(-4))
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
        setNotify('Không tìm thấy khách hàng')
        setCustomer(undefined)
      } finally {
        // Reset flag để các lần sau là do nhập tay
        loadedFromStorage.current = false
        loadedFromUser.current = false
      }
    }

    fetchCustomer()
  }, [phone, name, setValue])

  const createNewCustomer: SubmitHandler<CustomerInterface> = async (data) => {
    try {
      await authService.signUp({
        phone: data.phone,
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

  const viewHistory: SubmitHandler<CustomerInterface> = async (data) => {
    console.log('data', data)
    setOpenHistoryDialog(true)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('ordered_info_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setValue('phone', user.phone)
      setValue('name', user.name)
    }
  }, [setValue])

  const handleNextStep = () => {
    if (!orderedTempProduct || orderedTempProduct.length === 0) return
    if (phone.length === 10 && getValues('name')) {
      localStorage.setItem(
        'ordered_info_user',
        JSON.stringify({
          phone: getValues('phone'),
          name: getValues('name'),
          customer: customer
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
      <label htmlFor='phone'>Số điện thoại</label>
      <input
        {...register('phone', {
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
      {errors.phone && <div className='text-red-500 text-start text-sm'>{errors.phone.message}</div>}
      <label htmlFor='phone'>Tên khách hàng</label>
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
      {notify && (
        <div className='text-red-500 text-start text-sm'>
          {notify}
          {!user && notify !== 'Khách hàng mới' && (
            <button
              type='button'
              className='text-blue-500 underline ml-2 cursor-pointer'
              onClick={() => {
                navigate('/auth/login')
              }}
            >
              Đăng nhập
            </button>
          )}
          {!user && notify === 'Khách hàng mới' && (
            <button
              type='button'
              className='text-blue-500 underline ml-2 cursor-pointer'
              onClick={() => {
                navigate('/auth/signup')
              }}
            >
              Đăng Kí
            </button>
          )}
        </div>
      )}

      {user && !user.role.includes(Role.CUSTOMER) && (
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
      )}

      <button
        disabled={orderedTempProduct.length === 0}
        className={`${orderedTempProduct.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} px-4 py-2 bg-primary text-white rounded-xl w-full`}
        onClick={() => handleNextStep()}
      >
        Tiếp tục thanh toán
      </button>
      <OrderHistoryDialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} orders={dummyOrders} />
    </div>
  )
}

export default InfoCustomer
