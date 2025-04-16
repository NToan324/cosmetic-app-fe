import { CiUser } from 'react-icons/ci'
import { FiPhone } from 'react-icons/fi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useContext, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { AppContext } from '@/provider/appContext'
import { Role } from '@/consts'

const ConsultingCreate = () => {
  const [selectedSkinType, setSelectedSkinType] = useState('Select Skin Type')
  const [selectedSkinIssues, setSelectedSkinIssues] = useState('Select Skin Issues')
  const { activeShift, user } = useContext(AppContext)
  return (
    <form className='relative w-full rounded-2xl bg-white p-4'>
      {user && !user.role.includes(Role.CUSTOMER) && !activeShift && (
        <div className='absolute bg-black/70 top-0 left-0 w-full h-full z-50 '>
          <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4'>
            Bạn chưa mở ca làm việc. Vui lòng mở ca trước khi thao tác bán hàng.
          </div>
        </div>
      )}
      {user && !user.role.includes(Role.CONSULTANT) && activeShift && (
        <div className='absolute bg-black/70 top-0 left-0 w-full h-full z-50 '>
          <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4'>
            Chỉ có nhân viên tư vấn mới có thể tạo đơn tư vấn. Vui lòng chuyển sang tài khoản nhân viên để thao tác.
          </div>
        </div>
      )}
      <div className='flex justify-start items-center gap-4'>
        <h1 className='text-base font-semibold'>Create New Consultation</h1>
      </div>
      <div className='flex flex-wrap justify-start items-start gap-8 mt-4 rounded-2xl'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Customer Name
          </label>
          <div className='flex justify-start items-center gap-2 rounded-2xl w-[300px] bg-gray-100 p-4 focus:outline-black/25 focus:outline-1'>
            <CiUser size={25} />
            <input type='text' placeholder='Enter full name' className='border-none outline-none w-full' />
          </div>
        </div>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Phone Number
          </label>
          <div className='flex justify-start items-center gap-2 rounded-2xl w-[300px] bg-gray-100 p-4 focus:outline-black/25 focus:outline-1'>
            <FiPhone size={25} strokeWidth={1} />
            <input type='text' placeholder='Phone number' className='border-none outline-none w-full' />
          </div>
        </div>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Age
            <span className='text-red-500 ml-2 font-normal'>(Optional)</span>
          </label>
          <input
            type='text'
            placeholder='Enter age'
            className='rounded-2xl w-[300px] bg-gray-100 p-4 focus:outline-black/25 focus:outline-1'
          />
        </div>
      </div>
      <div className='flex flex-wrap justify-start items-start gap-8 bg-white rounded-2xl mt-4'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Skin Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className='w-[300px] flex justify-between items-center gap-2 bg-gray-100 rounded-xl py-2 px-4 cursor-pointer focus:outline-black/40 focus:outline-1'>
              {selectedSkinType} <IoIosArrowDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[300px] bg-white'>
              <DropdownMenuLabel>Skin Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Oily', 'Dry', 'Sensitive', 'Combination', 'Normal'].map((type) => (
                <DropdownMenuItem
                  key={type}
                  className='hover:bg-gray-200 transition-all duration-200 rounded-lg'
                  onClick={() => setSelectedSkinType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Skin Issues
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className='w-[300px] flex justify-between items-center gap-2 bg-gray-100 rounded-xl py-2 px-4 cursor-pointer focus:outline-black/40 focus:outline-1'>
              {selectedSkinIssues} <IoIosArrowDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[300px] bg-white'>
              <DropdownMenuLabel>Skin Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Acne', 'Dark Spots', 'Freckles', 'Aging', 'Normal'].map((type) => (
                <DropdownMenuItem
                  key={type}
                  className='hover:bg-gray-200 transition-all duration-200 rounded-lg'
                  onClick={() => setSelectedSkinIssues(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='flex flex-col justify-start items-start gap-8 bg-white rounded-2xl mt-4'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <label htmlFor='name' className='font-semibold'>
            Recommended Products
          </label>
          <input
            type='text'
            placeholder='Enter product name'
            className='rounded-2xl w-[300px] bg-gray-100 p-4 focus:outline-black/25 focus:outline-1'
          />
        </div>
        <div className='flex flex-col justify-start items-start gap-4 w-full'>
          <label htmlFor='name' className='font-semibold'>
            Consultation Content
          </label>
          <textarea
            placeholder='Enter consultation content'
            className='rounded-2xl w-full h-[200px] resize-none bg-gray-100 p-4 focus:outline-black/25 focus:outline-1'
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <button type='submit' className='bg-primary py-2 px-4 rounded-xl text-white mt-4 cursor-pointer'>
          Create new
        </button>
      </div>
    </form>
  )
}
export default ConsultingCreate
