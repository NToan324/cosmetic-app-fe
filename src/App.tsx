import '@/App.css'
import HomePage from '@/pages/client/homePage'
import CategoryPage from '@/pages/client/categoryPage'
import OrderPage from '@/pages/client/orderPage'
import PaymentPage from '@/pages/client/paymentPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import Dashboard from '@/pages/admin/admin'
import Product from '@/pages/admin/admin_product'
import Employee from '@/pages/admin/admin_employee'
import Customer from '@/pages/admin/admin_customer'
import Invoice from '@/pages/admin/admin_invoice'
import Event from '@/pages/admin/admin_event'
import Statistic from '@/pages/admin/admin_statistic'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage}></Route>
        <Route path='/home' Component={HomePage}></Route>
        <Route path='/category' Component={CategoryPage}></Route>
        <Route path='/order' Component={OrderPage}></Route>
        <Route path='/order/payment' Component={PaymentPage}></Route>

        <Route path='/admin/dashboard' Component={Dashboard}></Route>
        <Route path='/admin/product' Component={Product}></Route>
        <Route path='/admin/employee' Component={Employee}></Route>
        <Route path='/admin/customer' Component={Customer}></Route>
        <Route path='/admin/invoice' Component={Invoice}></Route>
        <Route path='/admin/event' Component={Event}></Route>
        <Route path='/admin/statistic' Component={Statistic}></Route>
      </Routes>
    </Router>
  )
}

export default App
