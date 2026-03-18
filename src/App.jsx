import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  const [page, setPage] = useState('login')

  return (
    <>
      {page === 'login' && <Login onSwitch={() => setPage('signup')} />}
      {page === 'signup' && <Signup onSwitch={() => setPage('login')} />}
    </>
  )
}

export default App
