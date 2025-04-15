import OrderedProduct from '@/components/client/Order/components/orderedProduct'
import Summary from '@/components/client/Payment/components/summary'
import { IoChevronBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OrderedProductInterface } from '../Order/order'
import { LOCAL_STORAGE_KEY } from '@/consts'

const Payment = () => {
  const navigate = useNavigate()

  const [orderedTempProducts, setOrderedTempProducts] = useState<Array<OrderedProductInterface>>([])
  useEffect(() => {
    const orderedProducts = localStorage.getItem(LOCAL_STORAGE_KEY.ORDERED_TEMP_PRODUCT)
    setOrderedTempProducts(JSON.parse(orderedProducts || '[]'))
    if (!orderedProducts) {
      navigate('/order')
    }
  }, [navigate])

  return (
    <div className='p-4'>
      <button
        className='bg-white py-2 px-4 rounded-xl flex justify-center items-center gap-2 shadow-md cursor-pointer hover:bg-black/5 transition-all duration-200'
        onClick={() => navigate(-1)}
      >
        <IoChevronBackOutline size={25} />
        <span>Chỉnh sửa đơn hàng</span>
      </button>
      <div className='flex justify-between items-start gap-4 mt-4 md:flex-row flex-col'>
        <div className='flex flex-1/2 flex-col justify-start items-start gap-4 bg-white p-5 rounded-2xl w-full  h-[650px] md:max-w-[450px]'>
          <h1 className='text-2xl font-bold'>Chi tiết đơn hàng</h1>
          <div className='flex flex-col justify-start items-start gap-4 overflow-y-auto w-full p-2'>
            {orderedTempProducts &&
              orderedTempProducts.length > 0 &&
              orderedTempProducts.map((item) => {
                return (
                  <OrderedProduct
                    image={item.orderedProduct.image_url}
                    quantity={item.orderedProduct.stock_quantity}
                    price={item.orderedProduct.price}
                    name={item.orderedProduct.name}
                    key={item.orderedProduct._id}
                    orderedQuantity={item.orderedQuantity}
                    isPayment={true}
                  />
                )
              })}
          </div>
        </div>
        <div className='bg-white p-2 rounded-2xl w-full md:w-2/3'>
          <Summary orderedTempProducts={orderedTempProducts} />
        </div>
      </div>
    </div>
  )
}

export default Payment
