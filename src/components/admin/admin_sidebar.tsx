import { LuLayoutDashboard } from "react-icons/lu";
import { BsBoxes } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { RiBillLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { TbLogout } from 'react-icons/tb'
import { NavLink, useLocation } from 'react-router-dom'

const Admin_SideBar = () => {
  const location = useLocation()
  const menu = [
    { name: 'Dashboard', icon: LuLayoutDashboard, link: '/admin/dashboard' },
    { name: 'Product', icon: BsBoxes, link: '/admin/product' },
    { name: 'Employee', icon: FiUsers, link: '/admin/employee' },
    { name: 'Customer', icon: FaRegUser, link: '/admin/customer' },
    { name: 'Invoice', icon: RiBillLine, link: '/admin/invoice' },
    { name: 'Event', icon: MdEvent, link: '/admin/event' },
    { name: 'Statistic', icon: FaRegChartBar, link: '/admin/statistic' },
    { name: 'Logout', icon: TbLogout, link: '/logout' }
  ]

  return (
    <div className='w-[250px] flex flex-col items-center h-screen space-y-5 fixed top-0 left-0 z-50'>
      <div className='p-6'>
        <h1 className='text-xl font-bold text-center text-amber-500'>
          ORR'<span className='text-black'> COSMETIC</span>
        </h1>
      </div>
      <ul className='w-full'>
        {menu.map((item, index) => {
          const isLogout = item.name === 'Logout';
          return (
            <div key={index}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  // Nếu là Logout thì không thay đổi màu nền và màu chữ của NavLink
                  isLogout
                    ? 'cursor-pointer ml-4 flex items-center rounded-bl-2xl rounded-tl-2xl py-4 px-8 h-[60px] gap-4'
                    : `cursor-pointer ml-4 flex items-center rounded-bl-2xl rounded-tl-2xl py-4 px-8 h-[60px] gap-4 ${
                        isActive || (item.link === '/home' && location.pathname === '/')
                          ? 'bg-primary text-white'
                          : 'text-black'
                      }`
                }
              >
                <item.icon size={25} className={`${isLogout ? 'text-red-500' : ''}`} />
                <span className={`text-base ${isLogout ? 'text-red-500' : ''}`}>
                  {item.name}
                </span>
              </NavLink>
              {index === 6 && <div className='border-t border-gray-300 w-full my-6'></div>}
            </div>
          )
        })}
      </ul>

    </div>
  )
}

export default Admin_SideBar
