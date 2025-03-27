import { IoSearch } from 'react-icons/io5'
import Avatar from '../assets/images/avatar.png'
const Search = () => {
  return (
    <div className='flex justify-between items-center bg-white w-full p-4 h-[80px] gap-2'>
      <div className='bg-gray-100 flex items-center justify-between gap-2 p-2 rounded-2xl w-[300px] h-[50px] px-4'>
        <IoSearch size={25} color='black' />
        <input type='text' placeholder='Search' className='text-black border-none outline-none w-full' />
      </div>
      <div className='flex justify-between items-center gap-2'>
        <img src={Avatar} alt='Avatar' width={45} height={45} />
        <div className='flex flex-col justify-center items-start'>
          <h1 className='text-base'>Alberts</h1>
          <p className='text-sm text-black/40'>Description</p>
        </div>
      </div>
    </div>
  )
}

export default Search
