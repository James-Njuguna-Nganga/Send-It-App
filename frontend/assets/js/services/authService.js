export async function register(fullName, email, password) {
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ fullName, email, password })
        });

        return await response.json();
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
}

export async function login(email, password, role) {
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password, role })
        });

        return await response.json();
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}