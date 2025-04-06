import { HiOutlineHome } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { HiOutlineArchiveBox } from 'react-icons/hi2'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { TbReportMedical } from 'react-icons/tb'
import { FiSettings } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { IoIosArrowBack } from 'react-icons/io'
import DialogSignout from '@/components/ui/dialogSignout'
const SideBar = () => {
  const location = useLocation()
  const { isOpen, setIsOpen, user } = useContext(AppContext)
  const menu = [
    { name: 'Home', icon: HiOutlineHome, link: '/home' },
    { name: 'Category', icon: BiCategoryAlt, link: '/category' },
    { name: 'Order', icon: IoDocumentTextOutline, link: '/order' },
    { name: 'History', icon: HiOutlineArchiveBox, link: '/history' },
    { name: 'Consulting', icon: TbReportMedical, link: '/customer-consulting' },
    { name: 'Setting', icon: FiSettings, link: '/setting' }
  ]
  return (
    <div
      className={
        'w-[250px] flex-col shadow-2xl bg-white items-center h-screen space-y-5 fixed top-0 left-0 z-50 transition-all duration-300 ease-out md:flex md:translate-x-0 md:shadow-none ' +
        (isOpen ? 'translate-x-0' : '-translate-x-full')
      }
    >
      <div
        className={`${isOpen ? '' : 'hidden'} absolute -right-10 top-5 bg-primary rounded-r-full p-2 cursor-pointer md:hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosArrowBack size={25} color='white' />
      </div>
      <div className='p-6'>
        <h1 className='text-xl font-bold text-center text-amber-500'>
          ORR'<span className='text-black'> COSMETIC</span>
        </h1>
      </div>
      <ul className='w-full'>
        {menu.map((item, index) => (
          <div key={index}>
            <NavLink
              onClick={() => setIsOpen(!isOpen)}
              to={item.link}
              className={({ isActive }) =>
                `cursor-pointer ml-4 flex items-center rounded-bl-2xl rounded-tl-2xl py-4 px-8 h-[60px] gap-4 ${
                  isActive || (item.link === '/home' && location.pathname === '/')
                    ? 'bg-primary text-white'
                    : 'text-black'
                }`
              }
            >
              <item.icon size={25} />
              <span className='text-base'>{item.name}</span>
            </NavLink>
            {index === 3 && <div className='border-t border-gray-300 w-full my-6'></div>}
          </div>
        ))}
        {user && <DialogSignout />}
      </ul>
    </div>
  )
}

export default SideBar
