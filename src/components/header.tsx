import Avatar from '@/assets/images/avatar.png'
import { IoMenu } from 'react-icons/io5'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import DialogLoginChoice from './ui/dialogOptionLogin'
import OpenShiftDialog from '@/components/client/shift/OpenShiftDialog'
import { Button } from '@mui/material'
import { Role } from '@/consts'
import shiftService from '@/services/shift.service'
import { toast } from 'react-toastify'
import CloseShiftDialog from './client/shift/CloseShiftDialog'

const Header = () => {
  const { isOpen, setIsOpen, user, activeShift, reload, setReload, shiftOpen } = useContext(AppContext)
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const handleOpenShift = async (opening_cash: number) => {
    if (user && user.role.includes(Role.SALESTAFF) && opening_cash <= 0) {
      toast.error('Vui lòng nhập số tiền mở ca')
      return
    }
    setIsLoading(true)
    try {
      if (accessToken) {
        await shiftService.openShift(accessToken, opening_cash)
        toast.success('Mở ca thành công')
      }
    } catch (error) {
      toast.error('Mở ca thất bại')
      console.error('Error opening shift:', error)
    } finally {
      setOpenDialog(false)
      setIsLoading(false)
      setReload(!reload)
    }
  }

  const handleCloseShift = async (actual_cash: number, note: string) => {
    if (user && user.role.includes(Role.SALESTAFF) && actual_cash <= 0) {
      toast.error('Vui lòng nhập số tiền thực tế')
      return
    }
    if (user && user.role.includes(Role.SALESTAFF) && actual_cash < shiftOpen.opening_cash) {
      toast.error('Số tiền thực tế phải lớn hơn hoặc bằng số tiền mở ca')
      return
    }
    setIsLoading(true)
    try {
      if (accessToken) {
        await shiftService.closeShift(accessToken, actual_cash, note)
        toast.success('Đóng ca thành công')
      }
    } catch (error) {
      toast.error('Đóng ca thất bại')
      console.error('Error closing shift:', error)
    } finally {
      setOpenDialog(false)
      setIsLoading(false)
      setReload(!reload)
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      setAccessToken(accessToken)
    }
  }, [])

  return (
    <div className='flex justify-end items-center bg-white w-full p-4 h-[80px] gap-4'>
      <IoMenu size={35} className='cursor-pointer md:hidden' onClick={() => setIsOpen(!isOpen)} />
      <div className='flex justify-end items-center w-full'>
        <div className='flex justify-between items-center gap-2'>
          {user ? (
            <>
              {!user.role.includes(Role.CUSTOMER) ? (
                !activeShift ? (
                  <>
                    <Button
                      variant='contained'
                      sx={{
                        bgcolor: '#ff8108',
                        color: 'white',
                        borderRadius: '10px'
                      }}
                      onClick={() => setOpenDialog(true)}
                    >
                      Mở ca làm việc
                    </Button>
                    <OpenShiftDialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      onSubmit={handleOpenShift}
                      user={user}
                      isLoading={isLoading}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant='contained'
                      sx={{
                        bgcolor: '#ff8108',
                        color: 'white',
                        borderRadius: '10px'
                      }}
                      onClick={() => setOpenDialog(true)}
                    >
                      Đóng ca
                    </Button>
                    <CloseShiftDialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      onSubmit={handleCloseShift}
                      isLoading={isLoading}
                    />
                  </>
                )
              ) : null}

              <img src={Avatar} alt='Avatar' width={45} height={45} />
              <div className='hidden flex-col justify-center items-start md:flex'>
                <h1 className='text-base'>{user.name}</h1>
                <p className='text-sm text-black/40'>{user.role[0]}</p>
              </div>
            </>
          ) : (
            <DialogLoginChoice />
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
