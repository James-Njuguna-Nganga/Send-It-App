document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || !user.isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // DOM Elements
    const elements = {
        logoutBtn: document.getElementById('logout-btn'),
        parcelForm: document.getElementById('parcel-form'),
        searchInput: document.querySelector('input[placeholder="Search Parcel..."]'),
        parcelsTable: document.querySelector('tbody')
    };

    // Event Listeners
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.parcelForm.addEventListener('submit', handleParcelCreate);
    elements.searchInput.addEventListener('input', handleSearch);

    // Load parcels on page load
    loadParcels();

    // Handlers
    async function handleParcelCreate(e) {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const parcelData = {
                senderName: formData.get('senderName'),
                senderEmail: formData.get('senderEmail'),
                receiverName: formData.get('receiverName'),
                receiverEmail: formData.get('receiverEmail'),
                pickupLocation: formData.get('pickup'),
                destination: formData.get('destination')
            };

            const response = await fetch('http://localhost:5000/api/parcels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(parcelData)
            });

            if (!response.ok) throw new Error('Failed to create parcel');

            showMessage('Parcel created successfully', 'success');
            e.target.reset();
            loadParcels();
        } catch (error) {
            console.error('Create parcel error:', error);
            showMessage('Failed to create parcel', 'error');
        }
    }

    async function loadParcels() {
        try {
            const response = await fetch('http://localhost:5000/api/parcels', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch parcels');

            const data = await response.json();
            renderParcels(data.data);
        } catch (error) {
            console.error('Load parcels error:', error);
            showMessage('Failed to load parcels', 'error');
        }
    }

    function renderParcels(parcels) {
        elements.parcelsTable.innerHTML = parcels.map(parcel => `
            <tr>
                <td>${parcel.ParcelID}</td>
                <td>${parcel.SenderName}</td>
                <td>${parcel.ReceiverName}</td>
                <td>${parcel.PickupLocation}</td>
                <td>${parcel.Destination}</td>
                <td>
                    <select onchange="updateStatus(${parcel.ParcelID}, this.value)">
                        <option value="Pending" ${parcel.Status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Transit" ${parcel.Status === 'In Transit' ? 'selected' : ''}>In Transit</option>
                        <option value="Delivered" ${parcel.Status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button onclick="editParcel(${parcel.ParcelID})" class="btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteParcel(${parcel.ParcelID})" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = elements.parcelsTable.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // Status Update Function
    window.updateStatus = async (parcelId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/parcels/${parcelId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) throw new Error('Failed to update status');

            showMessage(`Status updated to ${status}`, 'success');
        } catch (error) {
            console.error('Update status error:', error);
            showMessage('Failed to update status', 'error');
        }
    };

    // Edit Parcel Function
    window.editParcel = async (parcelId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/parcels/${parcelId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch parcel');

            const parcel = await response.json();
            // Implement edit modal or form population here
        } catch (error) {
            console.error('Edit parcel error:', error);
            showMessage('Failed to load parcel details', 'error');
        }
    };

    // Delete Parcel Function
    window.deleteParcel = async (parcelId) => {
        if (!confirm('Are you sure you want to delete this parcel?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/parcels/${parcelId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete parcel');

            showMessage('Parcel deleted successfully', 'success');
            loadParcels();
        } catch (error) {
            console.error('Delete parcel error:', error);
            showMessage('Failed to delete parcel', 'error');
        }
    };

    // Utility function for showing messages
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});