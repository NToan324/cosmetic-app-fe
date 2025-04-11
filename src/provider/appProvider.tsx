import { useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import authService, { User } from '@/services/auth.service'
import categoryService, { Category } from '@/services/category.service'
import brandService, { Brand } from '@/services/brand.service'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const [categories, setCategories] = useState<Array<Category>>([])
  const [brands, setBrands] = useState<Array<Brand>>([])
  const [reload, setReload] = useState<boolean>(false)

  useEffect(() => {
    const getUser = async () => {
      const userStorage = localStorage.getItem('accessToken')
      if (userStorage) {
        try {
          const { data } = await authService.getUser(userStorage)
          if (data) {
            setUser(data)
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Unknown error')
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
        throw new Error(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    const getBrands = async () => {
      try {
        const { data } = await brandService.getAllBrands()
        if (data) {
          setBrands(data)
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    getBrands()
    getCategories()
    getUser()
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
        setBrands
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
