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
import PasswordResetPage from '@/pages/auth/passwordResetPage'
import ForgotPasswordPage from '@/pages/auth/forgotPasswordPage'
import ProtectedRoute from './components/protectedRoute'
import { Role } from './consts'

function App() {
  return (
    <Router>
      <Routes>
        {/* Các route public */}
        <Route path='/auth/client/login' Component={LoginPage} />
        <Route path='/auth/employee/login' Component={LoginPage} />
        <Route path='/auth/client/signup' Component={SignUpPage} />
        <Route path='/auth/forgot-password' Component={ForgotPasswordPage} />
        <Route path='/auth/verify' Component={VerifyPage}></Route>
        <Route path='/auth/password-reset' Component={PasswordResetPage}></Route>
        <Route path='/unauthorized' element={<div>Unauthorized</div>} />
        <Route path='/home' Component={HomePage} />
        <Route path='/category' Component={CategoryPage} />
        <Route path='/order' Component={OrderPage} />
        <Route path='/' Component={HomePage} />

        {/* Route của khách hàng */}
        <Route element={<ProtectedRoute allowedRoles={[Role.CUSTOMER]} />}>
          <Route path='/order/payment' Component={PaymentPage} />
          <Route path='/history' Component={HistoryPage} />
          <Route path='/customer-consulting' Component={UserPage} />
        </Route>

        {/* Route của nhân viên/admin */}
        <Route element={<ProtectedRoute allowedRoles={[Role.MANAGER, Role.SALESTAFF, Role.CONSULTANT]} />}>
          <Route path='/admin/dashboard' Component={DashboardPage} />
          <Route path='/admin/product' Component={ProductPage} />
          <Route path='/admin/employee' Component={EmployeePage} />
          <Route path='/admin/customer' Component={CustomerPage} />
          <Route path='/admin/invoice' Component={InvoicePage} />
          <Route path='/admin/statistic' Component={StatisticPage} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
