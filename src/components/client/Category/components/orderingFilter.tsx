import { IoArrowDownOutline } from 'react-icons/io5'

interface OrderingFilterProps {
  filterPrice: string
  setFilterPrice: (price: string) => void
}
const OrderingFilter = ({ setFilterPrice, filterPrice }: OrderingFilterProps) => {
  return (
    <div className='flex flex-wrap justify-between items-center gap-4'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <button
          className={`${filterPrice === 'low' ? 'bg-primary text-white' : 'border border-primary text-primary'} flex justify-center items-center gap-2 text-base p-2 rounded-2xl cursor-pointer`}
          onClick={() => setFilterPrice('low')}
        >
          <span>Giá cao xuống thấp</span>
          <IoArrowDownOutline className='inline-block rotate-180' />
        </button>
        <button
          className={`${filterPrice === 'high' ? 'bg-primary text-white' : 'border border-primary text-primary'} flex justify-center items-center gap-2 text-base p-2 rounded-2xl cursor-pointer`}
          onClick={() => setFilterPrice('high')}
        >
          <span>Giá thấp lên cao</span>
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
            Hiển thị
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
