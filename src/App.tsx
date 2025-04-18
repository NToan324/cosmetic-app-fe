import '@/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from '@/pages/client/HomePage'
import CategoryPage from '@/pages/client/categoryPage'
import OrderPage from '@/pages/client/orderPage'
import PaymentPage from '@/pages/client/paymentPage'
import HistoryPage from '@/pages/client/historyPage'
import UserPage from '@/pages/client/userPage'
import ProfilePage from '@/pages/client/profilePage'
import ShiftPage from './pages/client/shiftPage'

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
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Các route public */}
          <Route path='/unauthorized' element={<div>Unauthorized</div>} />
          <Route path='/auth/login' element={LoginPage()} />
          <Route path='/auth/signup' element={SignUpPage()} />
          <Route path='/auth/forgot-password' element={ForgotPasswordPage()} />
          <Route path='/auth/verify' element={VerifyPage()}></Route>
          <Route path='/auth/password-reset' element={PasswordResetPage()}></Route>
          <Route path='/home' element={HomePage()} />
          <Route path='/category' element={CategoryPage()} />
          <Route path='/order' element={OrderPage()} />
          <Route path='/' element={HomePage()} />
          <Route path='/order/payment' element={PaymentPage()} />

          {/* Route của nhân viên bán hàng */}
          <Route element={<ProtectedRoute allowedRoles={[Role.SALESTAFF, Role.CONSULTANT, Role.MANAGER]} />}>
            <Route path='/customer-consulting' element={UserPage()} />
            <Route path='/shift' element={ShiftPage()} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.SALESTAFF, Role.CONSULTANT, Role.MANAGER]} />}
          >
            <Route path='/history' element={<HistoryPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>

          {/* Route của nhân viên/Manager */}
          <Route element={<ProtectedRoute allowedRoles={[Role.MANAGER]} />}>
            <Route path='/admin/dashboard' element={DashboardPage()} />
            <Route path='/admin' element={DashboardPage()} />
            <Route path='/admin/product' element={ProductPage()} />
            <Route path='/admin/employee' element={EmployeePage()} />
            <Route path='/admin/customer' element={CustomerPage()} />
            <Route path='/admin/invoice' element={InvoicePage()} />
            <Route path='/admin/statistic' element={StatisticPage()} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}

export default App
