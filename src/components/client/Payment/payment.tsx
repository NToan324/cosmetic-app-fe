import { orderedProductsDataMockup } from '@/mockup/product'
import OrderedProduct from '@/components/client/Order/components/orderedProduct'
import Summary from '@/components/client/Payment/components/summary'
import { IoChevronBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Payment = () => {
  const navigate = useNavigate()
  return (
    <div className='p-4'>
      <button
        className='bg-white py-2 px-4 rounded-xl flex justify-center items-center gap-2 shadow-md cursor-pointer hover:bg-black/5 transition-all duration-200'
        onClick={() => navigate(-1)}
      >
        <IoChevronBackOutline size={25} />
        <span>Back</span>
      </button>
      <div className='flex justify-between items-start gap-4 mt-4'>
        <div className='flex flex-1/2 flex-col justify-start items-start gap-4 bg-white p-5 rounded-2xl min-w-[450px] h-[650px]'>
          <h1 className='text-2xl font-bold'>Ordered Products</h1>
          <div className='flex flex-col justify-start items-start gap-4 overflow-y-auto w-full pl-2 pt-2'>
            {orderedProductsDataMockup &&
              orderedProductsDataMockup.length > 0 &&
              orderedProductsDataMockup.map((item) => {
                return (
                  <OrderedProduct
                    image={item.image}
                    quantity={item.quantity}
                    price={item.price}
                    name={item.name}
                    key={item.id}
                  />
                )
              })}
          </div>
        </div>
        <div className='bg-white p-2 rounded-2xl w-2/3'>
          <Summary />
        </div>
      </div>
    </div>
  )
}

export default Payment
