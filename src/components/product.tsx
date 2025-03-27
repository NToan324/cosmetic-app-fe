interface ProductProps {
  name: string
  price: number
  quantity: number
  image: string
}
const Product = ({ name, price, quantity, image }: ProductProps) => {
  return (
    <div className='flex flex-col justify-between items-center h-[250px] bg-white rounded-xl p-4'>
      <div className='flex justify-between items-start w-full gap-4 h-[160px]'>
        <div className='flex-1 w-[130px] h-full bg-gray-200 rounded-xl flex justify-center items-center'>
          <img src={image} alt='product' className='object-cover w-[80px]' />
        </div>
        <div className='flex-1 flex flex-col justify-between items-start'>
          <p className='text-black text-base text-start text-ellipsis'>{name}</p>
          <span className='text-primary text-base'>{price}đ</span>
        </div>
      </div>
      <div className='flex justify-between items-center w-full'>
        <span className='text-primary text-base'>Quantity: {quantity}</span>
        <button className='rounded-2xl px-4 py-2 bg-primary text-white cursor-pointer'>See Details</button>
      </div>
    </div>
  )
}

export default Product
