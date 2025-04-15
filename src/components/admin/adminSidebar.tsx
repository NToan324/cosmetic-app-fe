import { VscDashboard } from 'react-icons/vsc'
import { GoInbox } from 'react-icons/go'
import { HiOutlineUsers } from 'react-icons/hi2'
import { PiInvoice } from 'react-icons/pi'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { IoPieChartOutline } from 'react-icons/io5'
import { BiCategoryAlt } from 'react-icons/bi'
import { NavLink, useLocation } from 'react-router-dom'
import Avatar from '@/assets/images/avatar.png'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import DialogSignout from '../ui/dialogSignout'
const Admin_SideBar = () => {
  const location = useLocation()
  const { user } = useContext(AppContext)
  const menu = [
    { name: 'Tổng quan', icon: VscDashboard, link: '/admin/dashboard' },
    { name: 'Quản lý sản phẩm', icon: GoInbox, link: '/admin/product' },
    { name: 'Quản lý nhân viên', icon: HiOutlineUserGroup, link: '/admin/employee' },
    { name: 'Quản lý khách hàng', icon: HiOutlineUsers, link: '/admin/customer' },
    { name: 'Quán lý hóa đơn', icon: PiInvoice, link: '/admin/invoice' },
    { name: 'Thống kê', icon: IoPieChartOutline, link: '/admin/statistic' },
    { name: 'Bán hàng', icon: BiCategoryAlt, link: '/' }
  ]

  return (
    <div className='w-[280px] flex flex-col items-center h-screen space-y-5 fixed top-0 left-0 z-50'>
      <div className='flex justify-center items-center flex-col text-center gap-2 pt-5'>
        <img src={Avatar} alt='Avatar' width={45} height={45} />
        <div className='flex flex-col justify-center items-start'>
          <h1 className='text-base'>
            {user?.name}
            <br />
            <p className='text-gray-400 '>{user?.role[0]}</p>
          </h1>
        </div>
      </div>
      <ul className='w-full'>
        {menu.map((item, index) => {
          const isLogout = item.name === 'Logout'
          return (
            <div key={index}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
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
                <span className={`text-base ${isLogout ? 'text-red-500' : ''}`}>{item.name}</span>
              </NavLink>
              {index === 5 && <div className='border-t border-gray-300 w-full my-6'></div>}
            </div>
          )
        })}
        {user && <DialogSignout />}
      </ul>
    </div>
  )
}

export default Admin_SideBar
