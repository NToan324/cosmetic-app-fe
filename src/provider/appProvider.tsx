import { useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import authService, { User } from '@/services/auth.service'
import categoryService, { Category } from '@/services/category.service'
import brandService, { Brand } from '@/services/brand.service'
import shiftService, { Shift } from '@/services/shift.service'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Array<Category>>([])
  const [brands, setBrands] = useState<Array<Brand>>([])
  const [reload, setReload] = useState<boolean>(false)
  const [activeShift, setActiveShift] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [shiftOpen, setShiftOpen] = useState<Shift>({} as Shift)

  useEffect(() => {
    const getUser = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          const { data } = await authService.getUser(accessToken)
          if (data) {
            setUser(data)
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message)
          } else {
            setError('Unknown error')
          }
        }
      }
    }
    const getCategories = async () => {
      try {
        const { data } = await categoryService.getAllCategories()
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Unknown error')
        }
      }
    }
    const getBrands = async () => {
      try {
        const { data } = await brandService.getAllBrands()
        if (data) {
          setBrands(data)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Unknown error')
        }
      }
    }
    const getActiveShift = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          const { data } = await shiftService.getShiftOpenById(accessToken)
          if (data) {
            const isActive = !!data.start_time && !data.end_time
            setActiveShift(isActive)
            setShiftOpen(data)
          }
        } catch (error) {
          setActiveShift(false)
          if (error instanceof Error) {
            setError(error.message)
          } else {
            setError('Unknown error')
          }
        }
      }
    }
    getBrands()
    getCategories()
    getUser()
    getActiveShift()
  }, [reload])
  return (
    <AppContext.Provider
      value={{
        isOpen,
        setIsOpen,
        user,
        setUser,
        categories,
        setCategories,
        reload,
        setReload,
        brands,
        setBrands,
        activeShift,
        error,
        shiftOpen
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
