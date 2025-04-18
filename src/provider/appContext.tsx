import { User } from '@/services/auth.service'
import { Category } from '@/services/category.service'
import { createContext } from 'react'
import { Brand } from '@/services/brand.service'
interface AppContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  setUser: (user: AppContextType['user']) => void
  categories: Array<Category>
  setCategories: (categories: Array<Category>) => void
  reload: boolean
  setReload: (reload: boolean) => void
  brands: Array<Brand>
  setBrands: (brands: Array<Brand>) => void
  activeShift: boolean
  error: string
}

export const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {},
  user: {} as User,
  setUser: () => {},
  categories: [],
  setCategories: () => {},
  reload: false,
  setReload: () => {},
  brands: [],
  setBrands: () => {},
  activeShift: false,
  error: ''
})
