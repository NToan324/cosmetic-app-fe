import OrderedProduct from '@/components/client/Order/components/orderedProduct'
import InfoCustomer from '@/components/client/Order/components/infoCustomer'
import BarCode from '@/components/client/Order/components/barcode'
import EmptyImage from '@/assets/images/empty.jpg'
import { Product as ProduceInterface } from '@/services/product.service'
import { useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEY } from '@/consts'

export interface OrderedProductInterface {
  orderedProduct: ProduceInterface
  orderedQuantity: number
}

const Product = () => {
  const [orderedTempProduct, setOrderedTempProduct] = useState<Array<OrderedProductInterface>>([])
  useEffect(() => {
    const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY.ORDERED_TEMP_PRODUCT)
    if (storedProducts) {
      setOrderedTempProduct(JSON.parse(storedProducts))
    }
  }, [])

  useEffect(() => {
    if (orderedTempProduct.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY.ORDERED_TEMP_PRODUCT, JSON.stringify(orderedTempProduct))
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ORDERED_TEMP_PRODUCT)
    }
  }, [orderedTempProduct])

  return (
    <div className='p-4'>
      <div className='flex flex-wrap justify-between items-start gap-4'>
        <div className='flex-1/2 flex flex-col justify-between items-start gap-4'>
          <div className='flex flex-col justify-start items-start bg-white p-5 rounded-2xl w-full min-h-[220px]'>
            <h1 className='text-2xl font-bold'>Mã sản phẩm</h1>
            <BarCode setOrderedTempProduct={setOrderedTempProduct} />
          </div>
          <div className='flex flex-col justify-start items-start gap-4 bg-white p-5 rounded-2xl w-full'>
            <h1 className='text-2xl font-bold'>Sản phẩm đã thêm</h1>
            <div className='flex flex-col justify-start items-start gap-4 w-full h-[400px] overflow-y-auto pl-2 py-2'>
              {orderedTempProduct && orderedTempProduct.length > 0 ? (
                orderedTempProduct.map((item) => {
                  return (
                    <OrderedProduct
                      image={item.orderedProduct.image_url}
                      quantity={item.orderedProduct.stock_quantity}
                      price={item.orderedProduct.price}
                      name={item.orderedProduct.name}
                      code={item.orderedProduct.code}
                      orderedQuantity={item.orderedQuantity}
                      setOrderedTempProduct={setOrderedTempProduct}
                      key={item.orderedProduct._id}
                      edit={true}
                      isDelete={true}
                    />
                  )
                })
              ) : (
                <div className=' w-full flex flex-col justify-center items-center gap-4 p-5'>
                  <img src={EmptyImage} alt='empty cart' className='w-[200px] h-[200px] object-cover' />
                  <h1 className='text-black text-lg font-bold'>Hiện tại bạn chưa có sản phẩm nào</h1>
                </div>
              )}
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
