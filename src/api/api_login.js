import { API_BASE } from '../config';

const BASE_URL = API_BASE;

export async function api_login(email, password)
{
    const res = await fetch(`${BASE_URL}/api/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify({email,password})
    });
    if (!res.ok) {
        const body = await res.text();
        let message = 'Login failed';
        try {
            const parsed = JSON.parse(body);
            message = parsed.error || parsed.message || message;
        } catch { message = body || message; }
        throw new Error(message);
    }
    return res.json();

}

export default api_login