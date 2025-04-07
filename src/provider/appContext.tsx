import { User } from '@/services/auth'
import { Product } from '@/services/product'
import { Category } from '@/services/category'
import { createContext } from 'react'
interface AppContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User
  setUser: (user: AppContextType['user']) => void
  products: Array<Product>
  setProducts: (products: Array<Product>) => void
  categories: Array<Category>
  setCategories: (categories: Array<Category>) => void
}

export const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {},
  user: {} as User,
  setUser: () => {},
  products: [],
  setProducts: () => {},
  categories: [],
  setCategories: () => {}
})
