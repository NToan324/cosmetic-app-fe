import { IoArrowDownOutline } from 'react-icons/io5'
const OrderingFilter = () => {
  return (
    <div className='flex flex-wrap justify-between items-center gap-4'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <button className='flex justify-center items-center gap-2 border border-primary text-primary text-base p-2 rounded-2xl cursor-pointer'>
          <span>The price is low to high</span>
          <IoArrowDownOutline className='inline-block rotate-180' />
        </button>
        <button className='flex justify-center items-center gap-2 border border-primary text-primary text-base p-2 rounded-2xl cursor-pointer'>
          <span>The price is high to low</span>
          <IoArrowDownOutline className='inline-block' />
        </button>
      </div>
      <div className=''>
        <select
          className='border border-primary text-primary text-base p-2 rounded-2xl cursor-pointer w-[80x]'
          name='ordering'
          id='ordering'
        >
          <option value='' defaultValue={''}>
            Showing
          </option>
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='30'>30</option>
          <option value='50'>50</option>
        </select>
      </div>
    </div>
  )
}

export default OrderingFilter
