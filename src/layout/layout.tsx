import { ReactElement } from 'react'
import SideBar from '@/components/client/sidebar'
import Header from '@/components/header'

interface LayoutProps {
  children: ReactElement | ReactElement[]
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='w-screen h-screen'>
      <SideBar />
      <div className='md:ml-[250px] bg-[#F8F8F8]'>
        <Header />
        {children}
      </div>
    </div>
  )
}

export default Layout
