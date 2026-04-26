const BASE_URL= 'http://localhost:8080'; 

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