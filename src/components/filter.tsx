import { useState } from 'react'

interface FilterProps {
  filterData: string[]
}

const Filter = ({ filterData }: FilterProps) => {
  const [filter, setFilter] = useState(filterData[0])
  return (
    <div className='mt-4 flex justify-start items-center flex-wrap gap-4'>
      {filterData.map((item, index) => {
        return (
          <button
            className={`text-base text-center rounded-xl px-4 py-2 cursor-pointer ${filter === item ? 'bg-primary text-white' : 'text-black border border-black/30'}`}
            key={index}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

export default Filter
