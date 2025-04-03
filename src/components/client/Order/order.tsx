import OrderedProduct from '@/components/client/Order/components/orderedProduct'
import { orderedProductsDataMockup } from '@/mockup/product'
import InfoCustomer from '@/components/client/Order/components/infoCustomer'
import BarCode from '@/components/client/Order/components/barcode'
const Product = () => {
  return (
    <div className='p-4'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1/2 flex flex-col justify-between items-start gap-4'>
          <div className='flex flex-col justify-start items-start bg-white p-5 rounded-2xl w-full h-[220px]'>
            <h1 className='text-2xl font-bold'>Barcode</h1>
            <BarCode />
          </div>
          <div className='flex flex-col justify-start items-start gap-4 bg-white p-5 rounded-2xl w-full'>
            <h1 className='text-2xl font-bold'>Ordered Products</h1>
            <div className='flex flex-col justify-start items-start gap-4 w-full h-[400px] overflow-y-auto pl-2 pt-2'>
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
                      edit={true}
                    />
                  )
                })}
            </div>
          </div>
        </div>
        <div className='bg-white p-5 rounded-2xl w-[400px]'>
          <InfoCustomer />
        </div>
      </div>
    </div>
  )
}
export default Product
