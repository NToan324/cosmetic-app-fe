import { createContext } from 'react'
interface AppContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: {
    id: string
    phone: string
    name: string
    email?: string
    role: string[]
    rank?: string
    point?: number
    type?: string
  } | null
  setUser: (user: AppContextType['user']) => void
}
export const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {},
  user: null,
  setUser: () => {}
})
