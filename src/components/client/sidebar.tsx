import { HiOutlineHome } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { HiOutlineArchiveBox } from 'react-icons/hi2'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { TbReportMedical } from 'react-icons/tb'
import { CgProfile } from 'react-icons/cg'
import { NavLink, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { IoIosArrowBack } from 'react-icons/io'
import { VscDashboard } from 'react-icons/vsc'
import DialogSignout from '@/components/ui/dialogSignout'
import { TbTiltShift } from 'react-icons/tb'
import { Role } from '@/consts'

const SideBar = () => {
  const location = useLocation()
  const { isOpen, setIsOpen, user } = useContext(AppContext)
  const menu = [
    { name: 'Trang chủ', icon: HiOutlineHome, link: '/home' },
    { name: 'Sản phẩm', icon: BiCategoryAlt, link: '/category' },
    { name: 'Tạo đơn hàng', icon: IoDocumentTextOutline, link: '/order' },
    { name: 'Lịch sử mua hàng', icon: HiOutlineArchiveBox, link: '/history' },
    { name: 'Tư vấn', icon: TbReportMedical, link: '/customer-consulting' },
    { name: 'Ca làm', icon: TbTiltShift, link: '/shift' },
    { name: 'Tài khoản', icon: CgProfile, link: '/profile' },
    { name: 'Quản lý bán hàng', icon: VscDashboard, link: '/admin' }
  ]
  return (
    <div
      className={
        'w-[250px] z-[100] flex-col shadow-2xl bg-white items-center h-screen space-y-5 fixed top-0 left-0 transition-all duration-300 ease-out md:flex md:translate-x-0 md:shadow-none ' +
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
        {menu.map((item, index) => {
          const roleless = item.link === '/customer-consulting' || item.link === '/profile' || item.link === '/history'
          if (item.link === '/customer-consulting' && user?.role.includes(Role.CUSTOMER)) {
            return null
          }
          if (item.link === '/admin' && !user?.role.includes(Role.MANAGER)) {
            return null
          }
          if (roleless && !user) {
            return null
          }
          const allowedRoles = [Role.MANAGER, Role.CONSULTANT, Role.SALESTAFF]

          if (
            ((user && !user.role.some((role) => allowedRoles.includes(role as Role))) || !user) &&
            item.link === '/shift'
          ) {
            return null
          }

          return (
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
          )
        })}
        {user && <DialogSignout />}
      </ul>
    </div>
  )
}

export default SideBar
