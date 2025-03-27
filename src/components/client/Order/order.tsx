import OrderedProduct from './components/orderedProduct'
import { orderedProductsDataMockup } from '../../../mockup/product'
import InfoCustomer from './components/infoCustomer'
import BarCode from './components/barcode'
const Product = () => {
  return (
    <div className='p-4'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1/2 flex flex-col justify-between items-start gap-4'>
          <div className='bg-white p-10 rounded-2xl w-full'>
            <h1 className='text-2xl font-bold'>Enter the product</h1>
            <BarCode />
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-4 bg-white p-10 rounded-2xl h-[400px] overflow-y-auto'>
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
          <InfoCustomer />
        </div>
      </div>
    </div>
  )
}
export default Product
