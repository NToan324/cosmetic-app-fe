import { useState } from 'react'
import { AppContext } from '@/provider/appContext'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  return <AppContext.Provider value={{ isOpen, setIsOpen }}>{children}</AppContext.Provider>
}

export default AppProvider
