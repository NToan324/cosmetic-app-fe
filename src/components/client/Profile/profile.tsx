import { useState } from 'react'
import CustomerPointProgress from './CustomerPointProgress'
import UpdateUserInfoForm from './UpdateUserInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { Role } from '@/consts'

const CUSTOMER_PROFILE_TABS = {
  POINT: 'point',
  PROFILE: 'profile',
  PASSWORD: 'password'
}

const CustomerProfile = () => {
  const { user } = useContext(AppContext)
  const [selectedTab, setSelectedTab] = useState(
    user?.role.includes(Role.CUSTOMER) ? CUSTOMER_PROFILE_TABS.POINT : CUSTOMER_PROFILE_TABS.PROFILE
  )

  return (
    <div className='p-4 flex flex-col justify-start items-center gap-4'>
      <div className='flex justify-start items-center gap-4 w-full'>
        <h1 className='text-2xl font-bold text-start'>Thông tin người dùng</h1>
      </div>

      <div className='w-full flex flex-col justify-between items-start gap-4'>
        <div className='p-4 bg-white rounded-2xl flex justify-start items-start gap-4'>
          <ul className='flex justify-start items-start gap-4 text-start'>
            {user?.role.includes(Role.CUSTOMER) && (
              <li
                className={`${
                  selectedTab === CUSTOMER_PROFILE_TABS.POINT ? 'bg-[#ffe3c9] text-primary' : 'bg-white'
                } py-2 px-4 rounded-2xl cursor-pointer`}
                onClick={() => setSelectedTab(CUSTOMER_PROFILE_TABS.POINT)}
              >
                Điểm tích lũy
              </li>
            )}

            <li
              className={`${
                selectedTab === CUSTOMER_PROFILE_TABS.PROFILE ? 'bg-[#ffe3c9] text-primary' : 'bg-white'
              } py-2 px-4 rounded-2xl cursor-pointer`}
              onClick={() => setSelectedTab(CUSTOMER_PROFILE_TABS.PROFILE)}
            >
              Cập nhật thông tin
            </li>
            <li
              className={`${
                selectedTab === CUSTOMER_PROFILE_TABS.PASSWORD ? 'bg-[#ffe3c9] text-primary' : 'bg-white'
              } py-2 px-4 rounded-2xl cursor-pointer`}
              onClick={() => setSelectedTab(CUSTOMER_PROFILE_TABS.PASSWORD)}
            >
              Đổi mật khẩu
            </li>
          </ul>
        </div>

        <div className='w-full mt-4'>
          {selectedTab === CUSTOMER_PROFILE_TABS.POINT && <CustomerPointProgress point={user?.point || 0} />}
          {selectedTab === CUSTOMER_PROFILE_TABS.PROFILE && <UpdateUserInfoForm />}
          {selectedTab === CUSTOMER_PROFILE_TABS.PASSWORD && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile
