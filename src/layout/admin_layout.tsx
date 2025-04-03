import { ReactElement } from 'react'
import SideBar from '../components/admin/admin_sidebar'

interface LayoutProps {
  children: ReactElement | ReactElement[]
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='w-screen h-screen'>
      <SideBar />
      <div className='ml-[250px] bg-[#F8F8F8]'>
        {children}
      </div>
    </div>
  )
}

export default Layout
