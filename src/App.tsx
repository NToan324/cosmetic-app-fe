import '@/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from '@/pages/client/homePage'
import CategoryPage from '@/pages/client/categoryPage'
import OrderPage from '@/pages/client/orderPage'
import PaymentPage from '@/pages/client/paymentPage'
import HistoryPage from '@/pages/client/historyPage'
import UserPage from '@/pages/client/userPage'

import Dashboard from '@/pages/admin/admin'
import Product from '@/pages/admin/admin_product'
import Employee from '@/pages/admin/admin_employee'
import Customer from '@/pages/admin/admin_customer'
import Invoice from '@/pages/admin/admin_invoice'
import Statistic from '@/pages/admin/admin_statistic'

import Login from '@/pages/auth/login'
import SignUp from '@/pages/auth/signup'
import Verify from '@/pages/auth/verify'
import Password_Setting from '@/pages/auth/passwordsetting'
import Forgot_Password from '@/pages/auth/forgotpassword'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage}></Route>
        <Route path='/home' Component={HomePage}></Route>
        <Route path='/category' Component={CategoryPage}></Route>
        <Route path='/order' Component={OrderPage}></Route>
        <Route path='/order/payment' Component={PaymentPage}></Route>
        <Route path='/history' Component={HistoryPage}></Route>
        <Route path='/customer-consulting' Component={UserPage}></Route>

        <Route path='/admin' Component={Dashboard}></Route>
        <Route path='/admin/dashboard' Component={Dashboard}></Route>
        <Route path='/admin/product' Component={Product}></Route>
        <Route path='/admin/employee' Component={Employee}></Route>
        <Route path='/admin/customer' Component={Customer}></Route>
        <Route path='/admin/invoice' Component={Invoice}></Route>
        <Route path='/admin/statistic' Component={Statistic}></Route>

        <Route path='/auth/client/login' Component={Login}></Route>
        <Route path='/auth/employee/login' Component={Login}></Route>
        <Route path='/auth/client/signup' Component={SignUp}></Route>

        <Route path='/verify' Component={Verify}></Route>
        <Route path='/auth/passwordsetting' Component={Password_Setting}></Route>
        <Route path='/auth/forgotpassword' Component={Forgot_Password}></Route>      
      </Routes>
    </Router>
  )
}

export default App
