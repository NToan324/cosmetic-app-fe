import '@/App.css'
import HomePage from '@/pages/client/homePage'
import CategoryPage from '@/pages/client/categoryPage'
import OrderPage from '@/pages/client/orderPage'
import PaymentPage from '@/pages/client/paymentPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage}></Route>
        <Route path='/home' Component={HomePage}></Route>
        <Route path='/category' Component={CategoryPage}></Route>
        <Route path='/order' Component={OrderPage}></Route>
        <Route path='/order/payment' Component={PaymentPage}></Route>
      </Routes>
    </Router>
  )
}

export default App
