import { useState } from 'react'
import Login from './pages/Login'
import './App.css'

function App() {
  const [page, setPage] = useState('login')

  return (
    <div className="auth-page">
      {page === 'login' && <Login onSwitch={() => setPage('signup')} />}
    </div>
  )
}

export default App
