import '@/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from '@/pages/client/HomePage'
import CategoryPage from '@/pages/client/categoryPage'
import OrderPage from '@/pages/client/orderPage'
import PaymentPage from '@/pages/client/paymentPage'
import HistoryPage from '@/pages/client/historyPage'
import UserPage from '@/pages/client/userPage'

import DashboardPage from '@/pages/admin/admin'
import ProductPage from '@/pages/admin/adminProductPage'
import EmployeePage from '@/pages/admin/adminEmployeePage'
import CustomerPage from '@/pages/admin/adminCustomerPage'
import InvoicePage from '@/pages/admin/adminInvoicePage'
import StatisticPage from '@/pages/admin/adminStatisticPage'

import LoginPage from '@/pages/auth/loginPage'
import SignUpPage from '@/pages/auth/signupPage'
import VerifyPage from '@/pages/auth/verifyCodePage'
import PasswordSettingPage from '@/pages/auth/passwordResetPage'
import ForgotPasswordPage from '@/pages/auth/forgotPasswordPage'

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

        <Route path='/admin' Component={DashboardPage}></Route>
        <Route path='/admin/dashboard' Component={DashboardPage}></Route>
        <Route path='/admin/product' Component={ProductPage}></Route>
        <Route path='/admin/employee' Component={EmployeePage}></Route>
        <Route path='/admin/customer' Component={CustomerPage}></Route>
        <Route path='/admin/invoice' Component={InvoicePage}></Route>
        <Route path='/admin/statistic' Component={StatisticPage}></Route>

        <Route path='/auth/client/login' Component={LoginPage}></Route>
        <Route path='/auth/employee/login' Component={LoginPage}></Route>
        <Route path='/auth/client/signup' Component={SignUpPage}></Route>

        <Route path='/auth/verify' Component={VerifyPage}></Route>
        <Route path='/auth/password-reset' Component={PasswordSettingPage}></Route>
        <Route path='/auth/forgot-password' Component={ForgotPasswordPage}></Route>
      </Routes>
    </Router>
  )
}

export default App
