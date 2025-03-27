import { AiOutlinePlus } from 'react-icons/ai'
import { FiMinus } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
interface OrderedProductProps {
  image: string
  quantity: number
  price: number
  name: string
}

const OrderedProduct = ({ image, quantity, price, name }: OrderedProductProps) => {
  return (
    <div className='flex flex-wrap justify-between items-center gap-4'>
      <div className='w-[350px] h-[130px] shadow-[0_5px_10px_rgba(0,0,0,0.2)] bg-white rounded-xl p-4 flex justify-between items-center gap-4'>
        <div className='w-[130px] h-full bg-gray-200 rounded-xl flex justify-center items-center'>
          <img src={image} alt='product' className='object-cover w-[40px]' />
        </div>
        <div className=''>
          <p className='text-start'>{name}</p>
          <div className='flex justify-between items-center gap-2'>
            <span className='text-base'>x{quantity}</span>
            <span className='text-red-600 text-xl'>{price}đ</span>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex justify-between items-center gap-4'>
          <button className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer'>
            <AiOutlinePlus />
          </button>
          <span className='font-bold'>1</span>
          <button className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer'>
            <FiMinus />
          </button>
        </div>
        <div className='flex justify-center items-center rounded-xl bg-red-500 text-white cursor-pointer w-[40px] h-[40px]'>
          <AiOutlineDelete size={25} />
        </div>
      </div>
    </div>
  )
}
export default OrderedProduct
