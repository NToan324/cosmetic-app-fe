import { IoSearch } from 'react-icons/io5'
import Avatar from '@/assets/images/avatar.png'
import { IoMenu } from 'react-icons/io5'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'

const Search = () => {
  const { isOpen, setIsOpen } = useContext(AppContext)
  return (
    <div className='flex justify-between items-center bg-white w-full p-4 h-[80px] gap-4'>
      <IoMenu size={35} className='cursor-pointer md:hidden' onClick={() => setIsOpen(!isOpen)} />
      <div className='flex justify-end items-center w-full md:justify-between'>
        <div className='bg-white flex items-center justify-between gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
          <IoSearch size={25} color='black' />
          <input
            type='text'
            placeholder='Search'
            className='text-black border-none outline-none w-full hidden md:block'
          />
        </div>
        <div className='flex justify-between items-center gap-2'>
          <img src={Avatar} alt='Avatar' width={45} height={45} />
          <div className='hidden flex-col justify-center items-start md:flex'>
            <h1 className='text-base'>Alberts</h1>
            <p className='text-sm text-black/40'>Description</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
