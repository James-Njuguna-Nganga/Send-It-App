class AuthService {
    static BASE_URL = 'http://localhost:5500/api';

    static handleResponse(response) {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data.message));
        }
        return response.json();
    }

    static getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        };
    }

    static async fetchParcels() {
        return fetch(`${this.BASE_URL}/parcels`, {
            headers: this.getHeaders()
        }).then(this.handleResponse);
    }

    static async createParcel(parcelData) {
        return fetch(`${this.BASE_URL}/parcels`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(parcelData)
        }).then(this.handleResponse);
    }

    static async updateParcel(id, updateData) {
        return fetch(`${this.BASE_URL}/parcels/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(updateData)
        }).then(this.handleResponse);
    }

    static async deleteParcel(id) {
        return fetch(`${this.BASE_URL}/parcels/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        }).then(this.handleResponse);
    }
}

export default AuthService;