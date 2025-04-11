import { Category } from '@/services/category.service'

interface FilterProps {
  filterData: Array<Category>
  filterCategory: string
  setFilterCategory: (categoryId: string) => void
}

const Filter = ({ filterData, filterCategory, setFilterCategory }: FilterProps) => {
  return (
    <div className='mt-4 flex justify-start items-center flex-wrap gap-4'>
      <button
        className={`text-base text-center rounded-xl px-4 py-2 cursor-pointer ${filterCategory === 'all' ? 'bg-primary text-white' : 'text-black border border-black/30'}`}
        onClick={() => setFilterCategory('all')}
      >
        All
      </button>
      {filterData.map((item) => {
        return (
          <button
            className={`text-base text-center rounded-xl px-4 py-2 cursor-pointer ${filterCategory === item._id ? 'bg-primary text-white' : 'text-black border border-black/30'}`}
            key={item._id}
            onClick={() => setFilterCategory(item._id)}
          >
            {item.name}
          </button>
        )
      })}
    </div>
  )
}

export default Filter
