import { useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import authService, { User } from '@/services/auth'
import productService, { Product } from '@/services/product'
import categoryService, { Category } from '@/services/category'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const [products, setProducts] = useState<Array<Product>>([])
  const [categories, setCategories] = useState<Array<Category>>([])

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
    const getProducts = async () => {
      try {
        const { data } = await productService.getAllProducts()
        if (data) {
          setProducts(data)
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error')
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
    getCategories()
    getUser()
    getProducts()
  }, [])
  return (
    <AppContext.Provider value={{ isOpen, setIsOpen, user, setUser, products, setProducts, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
