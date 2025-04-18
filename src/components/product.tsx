import { formatCurrency } from '@/helpers'
import ProductDetailCard from './client/ProductDetailCard'
import { useState } from 'react'
import { Button } from './ui/button'

interface ProductProps {
  name: string
  price: number
  quantity: number
  image: string
  description: string
  expiration_date: string
  production_date: string
  code?: string
}
const Product = ({
  name,
  price,
  quantity,
  image,
  description,
  expiration_date,
  production_date,
  code
}: ProductProps) => {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className='flex flex-col justify-between items-center h-[250px] bg-white rounded-xl p-4'>
      <div className='flex justify-between items-start w-full gap-4 h-[160px]'>
        <div className='flex-1 w-[130px] h-full bg-white rounded-xl flex justify-center items-center'>
          <img src={image} alt='product' className='object-cover ' />
        </div>
        <div className='flex-1 flex flex-col justify-between items-start gap-1'>
          <p className='text-black text-base text-start text-ellipsis'>{name}</p>
          <span className='text-primary text-base'>{formatCurrency(price)}</span>
          <span className='text-primary text-base'>Mã sản phẩm: {code}</span>
        </div>
      </div>
      <div className='flex justify-between items-center w-full'>
        <span className='text-primary text-base'>Số lượng: {quantity}</span>
        <Button
          className='rounded-2xl px-4 py-2 bg-primary text-white cursor-pointer'
          onClick={() => setShowDetail(true)}
        >
          Xem chi tiết
        </Button>
      </div>
      {showDetail && (
        <div className='fixed inset-0 z-50 bg-black/40 bg-opacity-50 flex justify-center items-center p-4'>
          <div className='relative bg-white rounded-lg overflow-auto max-h-[90vh]'>
            <Button
              className='absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-xl'
              onClick={() => setShowDetail(false)}
            >
              Đóng
            </Button>
            <ProductDetailCard
              name={name}
              price={price}
              image_url={image}
              stock_quantity={quantity}
              description={description}
              production_date={production_date}
              expiration_date={expiration_date}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
