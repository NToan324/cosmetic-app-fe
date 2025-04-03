import { createContext } from 'react'
interface AppContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
export const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {}
})
