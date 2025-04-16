import { formatCurrency } from '@/helpers'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { OrderedProductInterface } from '../../Order/order'
import orderService from '@/services/order.service'
import { LOCAL_STORAGE_KEY } from '@/consts'
import customerService, { CustomerInfo } from '@/services/customer.service'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { User } from '@/services/auth.service'
import { useQueryClient } from '@tanstack/react-query'

interface CashProps {
  amount: number
  orderedTempProducts: Array<OrderedProductInterface>
  pointDiscount: number
  user: User | undefined
  setReload: (reload: boolean) => void
  reload: boolean
}

const Cash = ({ amount, orderedTempProducts, pointDiscount, user, reload, setReload }: CashProps) => {
  const [amountDefault, setAmountDefault] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [orderedInfoUser, setOrderedInfoUser] = useState<CustomerInfo>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    const infoUser = localStorage.getItem(LOCAL_STORAGE_KEY.ORDERED_INFO_USER)
    const user = localStorage.getItem(LOCAL_STORAGE_KEY.USER)
    if (user) {
      setOrderedInfoUser(JSON.parse(infoUser || '{}'))
    }
  }, [])

  const listMoney = [
    { id: 1, amount: 10000 },
    { id: 2, amount: 20000 },
    { id: 3, amount: 50000 },
    { id: 4, amount: 100000 },
    { id: 5, amount: 200000 },
    { id: 6, amount: 500000 }
  ]

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const moneyCustomer = e.target.value
    const moneyCustomerNumber = moneyCustomer.replace(/\./g, '').replace(/,/g, '.')
    setAmountDefault(Number(moneyCustomerNumber))
    if (Number(moneyCustomerNumber) > amount) {
      setChange(Number(moneyCustomerNumber) - amount)
    }
    if (Number(moneyCustomerNumber) <= amount) {
      setChange(0)
    }
  }

  const handleClickAmountDefault = (item: number) => {
    setAmountDefault(item)
    if (item > amount) {
      setChange(item - amount)
    }
    if (item <= amount) {
      setChange(0)
    }
  }

  const handlePaymentByCash = async () => {
    if (amountDefault < amount) {
      toast.error(`Bạn còn thiếu ${formatCurrency(amount - amountDefault)}`)
      return
    }
    const items = orderedTempProducts.map((item) => {
      return {
        product_id: item.orderedProduct._id,
        quantity: item.orderedQuantity,
        price: item.orderedProduct.price
      }
    })

    try {
      await orderService.createOrder({
        userId: orderedInfoUser?._id || '',
        createdBy: user?.id || '',
        paymentMethod: 'Cash',
        order: {
          items: items,
          discount_point: pointDiscount
        }
      })
      localStorage.removeItem(LOCAL_STORAGE_KEY.ORDERED_TEMP_PRODUCT)
      localStorage.removeItem(LOCAL_STORAGE_KEY.ORDERED_INFO_USER)
      setOrderedInfoUser(undefined)
      toast.success('Thanh toán thành công')
      navigate('/order')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Thanh toán thất bại')
      }
    }
    queryClient.invalidateQueries({ queryKey: ['histories'] })
    setReload(!reload)
  }
  return (
    <div className='flex flex-col justify-start items-start gap-4 bg-[#F8F8F8] p-4 rounded-2xl w-full'>
      <div className='flex flex-wrap justify-between items-start w-full space-y-4 gap-4'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='amount'>Tiền khách đưa</label>
          <NumericFormat
            id='amount'
            value={amountDefault}
            onChange={(e) => handleAmount(e)}
            thousandSeparator='.'
            decimalSeparator=','
            placeholder='100.000'
            className='bg-white border border-black/50 px-4 h-[55px] rounded-2xl w-2/3 outline-none'
          />
          <div className='flex flex-wrap justify-start items-center gap-4'>
            {listMoney.map((item) => {
              return (
                <button
                  className='p-4 rounded-2xl bg-white cursor-pointer hover:text-[#ff8108] transition-all duration-300 ease-in-out'
                  key={item.id}
                  onClick={() => handleClickAmountDefault(item.amount)}
                >
                  {formatCurrency(item.amount)}
                </button>
              )
            })}
          </div>
        </div>
        <div className='flex flex-col justify-start items-start gap-4 w-full'>
          <label htmlFor='change'>Tiền trả lại</label>
          <NumericFormat
            disabled
            value={change}
            id='change'
            thousandSeparator='.'
            decimalSeparator=','
            placeholder='100.000'
            className='bg-white border border-black/50 px-4 h-[55px] rounded-2xl w-2/3 outline-none'
          />
        </div>
        {/* Button thanh toan */}
      </div>
      <button
        type='button'
        className='px-4 py-2 bg-primary text-white rounded-xl whitespace-nowrap cursor-pointer'
        onClick={() => handlePaymentByCash()}
      >
        Thanh toán
      </button>
    </div>
  )
}

export default Cash
