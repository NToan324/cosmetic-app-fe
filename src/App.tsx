import './App.css'
import HomePage from './pages/client/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={HomePage}></Route>
      </Routes>
    </Router>
  )
}

export default App
