import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_BASE } from '../config'

const BASE_URL = API_BASE

export default function PrivateRoute({ children }) {
    const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

    useEffect(() => {
        fetch(`${BASE_URL}/api/auth/me`, {
            credentials: 'include'  // sends the JWT cookie (or JSESSIONID) automatically
        })
            .then(res => {
                if (res.ok) setStatus('ok')
                else setStatus('denied')
            })
            .catch(() => setStatus('denied'))
    }, [])

    if (status === 'checking') return null          // still loading — show nothing
    if (status === 'denied')   return <Navigate to="/login" replace />
    return children
}
