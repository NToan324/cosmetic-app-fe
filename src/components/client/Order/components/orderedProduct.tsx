import { AiOutlinePlus } from 'react-icons/ai'
import { FiMinus } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { formatCurrency } from '@/helpers'
import { OrderedProductInterface } from '@/components/client/Order/order'
interface OrderedProductProps {
  image: string
  quantity: number
  price: number
  name: string
  code?: string
  edit?: boolean
  setOrderedQuantity?: React.Dispatch<React.SetStateAction<number>>
  setOrderedTempProduct?: React.Dispatch<React.SetStateAction<OrderedProductInterface[]>>
  orderedQuantity?: number
}

const OrderedProduct = ({
  image,
  quantity,
  price,
  name,
  code,
  edit,
  setOrderedQuantity,
  setOrderedTempProduct,
  orderedQuantity
}: OrderedProductProps) => {
  const handleIncrease = () => {
    if (!orderedQuantity) return
    if (setOrderedTempProduct) {
      setOrderedTempProduct((prev) =>
        prev.map((item) =>
          item.orderedProduct.code === code ? { ...item, orderedQuantity: orderedQuantity + 1 } : item
        )
      )
    }
    if (!setOrderedQuantity) return
    if (orderedQuantity <= quantity) {
      setOrderedQuantity(orderedQuantity + 1)
    }
  }
  const handleDecrease = () => {
    if (!orderedQuantity) return
    if (setOrderedTempProduct) {
      setOrderedTempProduct((prev) =>
        prev.map((item) =>
          item.orderedProduct.code === code ? { ...item, orderedQuantity: orderedQuantity - 1 } : item
        )
      )
    }
    if (!setOrderedQuantity) return
    if (orderedQuantity > 1) {
      setOrderedQuantity(orderedQuantity - 1)
    }
  }

  const handleDelete = () => {
    if (!setOrderedTempProduct) return
    setOrderedTempProduct((prev) => prev.filter((item) => item.orderedProduct.code !== code))
  }

  return (
    <div className='flex flex-wrap justify-between items-center gap-4'>
      <div className='w-[350px] h-[130px] shadow-[0_5px_10px_rgba(0,0,0,0.2)] bg-white rounded-xl p-4 flex justify-between items-center gap-4'>
        <div className='w-[130px] h-full bg-white rounded-xl flex justify-center items-center'>
          <img src={image} alt='product' className='object-cover' />
        </div>
        <div className='flex flex-col justify-between items-start gap-2 w-full'>
          <p className='text-start'>{name}</p>
          <p className='text-start'>{code}</p>
          <div className='flex justify-between items-center gap-2 w-full'>
            <span className='text-base'>x{quantity}</span>
            <span className='text-red-600 text-xl'>{formatCurrency(price)}</span>
          </div>
        </div>
      </div>
      {edit && (
        <div className='flex justify-between items-center gap-4'>
          <div className='flex justify-between items-center gap-3'>
            <button
              onClick={handleIncrease}
              className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer'
            >
              <AiOutlinePlus />
            </button>
            <span className='font-bold'>{orderedQuantity}</span>
            <button
              onClick={handleDecrease}
              className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer'
            >
              <FiMinus />
            </button>
          </div>
          <div
            onClick={handleDelete}
            className='flex justify-center items-center rounded-xl bg-red-500 text-white cursor-pointer w-[40px] h-[40px]'
          >
            <AiOutlineDelete size={25} />
          </div>
        </div>
      )}
    </div>
  )
}
export default OrderedProduct
