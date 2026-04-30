import { API_BASE } from '../config';

const BASE_URL = API_BASE;

export async function api_login(email, password)
{
    const res = await fetch(`${BASE_URL}/api/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({email,password})
    });
    if (!res.ok) throw new Error( await res.text());
    return res.json();

}

export default api_login