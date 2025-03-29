import { orderedProductsDataMockup } from '@/mockup/product'
import OrderedProduct from '@/components/client/Order/components/orderedProduct'

const Payment = () => {
  return (
    <div className='p-4'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex flex-col justify-start items-start gap-4 bg-white p-10 rounded-2xl w-full'>
          <h1 className='text-2xl font-bold'>Ordered Products</h1>
          <div className='flex flex-col justify-start items-start gap-4 w-full h-[400px] overflow-y-auto'>
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
        <div className='bg-white p-10 rounded-2xl w-[400px]'>
          <h1>Thanh toan</h1>
        </div>
      </div>
    </div>
  )
}

export default Payment
