import { useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import authService, { User } from '@/services/auth'
import productService, { Product } from '@/services/product'
import categoryService, { Category } from '@/services/category'
import customerService, { Customer } from '@/services/customer'
import employeeService, { Employee } from '@/services/employee'
import brandService, { Brand } from '@/services/brand'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const [products, setProducts] = useState<Array<Product>>([])
  const [categories, setCategories] = useState<Array<Category>>([])
  const [customers, setCustomers] = useState<Array<Customer>>([])
  const [employees, setEmployees] = useState<Array<Employee>>([])
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
    const getCustomers = async () => {
      const userStorage = localStorage.getItem('accessToken')
      if (userStorage) {
        try {
          const { data } = await customerService.getCustomer(userStorage)
          if (data) {
            setCustomers(data)
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Unknown error')
        }
      }
    }
    const getEmployees = async () => {
      const userStorage = localStorage.getItem('accessToken')
      if (userStorage) {
        try {
          const { data } = await employeeService.getEmployees(userStorage)
          if (data) {
            setEmployees(data)
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Unknown error')
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
        throw new Error(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    getBrands()
    getEmployees()
    getCustomers()
    getCategories()
    getUser()
    getProducts()
  }, [reload])
  return (
    <AppContext.Provider
      value={{
        isOpen,
        setIsOpen,
        user,
        setUser,
        products,
        setProducts,
        categories,
        setCategories,
        customers,
        setCustomers,
        employees,
        setEmployees,
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
