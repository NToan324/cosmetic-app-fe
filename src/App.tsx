import './App.css'
import HomePage from './pages/client/homePage'
import CategoryPage from './pages/client/categoryPage'
import OrderPage from './pages/client/orderPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage}></Route>
        <Route path='/home' Component={HomePage}></Route>
        <Route path='/category' Component={CategoryPage}></Route>
        <Route path='/order' Component={OrderPage}></Route>
      </Routes>
    </Router>
  )
}

export default App
