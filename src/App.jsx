import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import TripOverview from './pages/TripOverview'
import TripDetails from './pages/TripDetails'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/trips" element={<TripOverview />} />
      <Route path="/trips/new/details" element={<TripDetails />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App