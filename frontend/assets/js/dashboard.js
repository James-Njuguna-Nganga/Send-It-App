<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", async () => {
    const sentParcelsTable = document.querySelector("#sent-parcels tbody");
    const receivedParcelsTable = document.querySelector("#received-parcels tbody");
    const searchSent = document.getElementById("search-sent");
    const searchReceived = document.getElementById("search-received");
    const logoutBtn = document.getElementById("logout-btn");

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
=======
const parcelService= require('./services/parcelService');
document.addEventListener("DOMContentLoaded", async () => {c
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
>>>>>>> Samuel
    }

    const isAdmin = currentUser.role === "1";
    
    const elements = {
        sentParcelsTable: document.querySelector("#sent-parcels tbody"),
        receivedParcelsTable: document.querySelector("#received-parcels tbody"),
        searchSent: document.getElementById("search-sent"),
        searchReceived: document.getElementById("search-received"),
        logoutBtn: document.getElementById("logout-btn"),
        newParcelForm: document.getElementById("new-parcel-form")
    };

    // Handle new parcel creation
    elements.newParcelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newParcel = {
            id: Date.now(),
            userId: currentUser.id,
            receiverName: formData.get('receiver_name'),
            pickup: formData.get('pickup'),
            destination: formData.get('destination'),
            description: formData.get('description'),
            status: 'pending'
        };

        const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
        parcels.push(newParcel);
        localStorage.setItem('parcels', JSON.stringify(parcels));
        showMessage('Parcel created successfully', 'success');
        loadParcels();
        e.target.reset();
    });

    // Handle logout
    elements.logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Handle search
    elements.searchSent.addEventListener('input', (e) => {
        filterParcels(e.target.value, 'sent');
    });

    elements.searchReceived.addEventListener('input', (e) => {
        filterParcels(e.target.value, 'received');
    });

    function loadParcels() {
        const parcels = JSON.parse(localStorage.getItem('parcels') || '[]');
        
        // Clear existing tables
        elements.sentParcelsTable.innerHTML = '';
        elements.receivedParcelsTable.innerHTML = '';

        parcels.forEach(parcel => {
            const row = createParcelRow(parcel);
            if (parcel.userId === currentUser.id) {
                elements.sentParcelsTable.appendChild(row);
            } else if (parcel.receiverName === currentUser.fullName) {
                elements.receivedParcelsTable.appendChild(row);
            }
        });
    }

    function createParcelRow(parcel) {
        const row = document.createElement('tr');
        row.dataset.id = parcel.id;
        row.innerHTML = `
            <td>${parcel.id}</td>
            <td>${parcel.receiverName}</td>
            <td>${parcel.pickup}</td>
            <td>${parcel.status}</td>
            <td>
                <button onclick="viewParcelDetails(${parcel.id})" class="btn-view">View</button>
                ${isAdmin ? `
                    <button onclick="editParcel(${parcel.id})" class="btn-edit">Edit</button>
                    <button onclick="deleteParcel(${parcel.id})" class="btn-delete">Delete</button>
                ` : ''}
            </td>
        `;
        return row;
    }

    function filterParcels(searchTerm, type) {
        const table = type === 'sent' ? elements.sentParcelsTable : elements.receivedParcelsTable;
        const rows = table.getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    window.editParcel = function(id) {
        if (!isAdmin) {
            showMessage('Only admins can edit parcels', 'error');
            return;
        }

        const parcels = JSON.parse(localStorage.getItem('parcels'));
        const parcel = parcels.find(p => p.id === id);
        
        if (parcel) {
            const newStatus = prompt('Enter new status:', parcel.status);
            if (newStatus) {
                parcel.status = newStatus;
                localStorage.setItem('parcels', JSON.stringify(parcels));
                loadParcels();
                showMessage('Parcel updated successfully', 'success');
            }
        }
    };

    window.deleteParcel = function(id) {
        if (!isAdmin) {
            showMessage('Only admins can delete parcels', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this parcel?')) {
            const parcels = JSON.parse(localStorage.getItem('parcels'));
            const updatedParcels = parcels.filter(p => p.id !== id);
            localStorage.setItem('parcels', JSON.stringify(updatedParcels));
            loadParcels();
            showMessage('Parcel deleted successfully', 'success');
        }
    };

    window.viewParcelDetails = function(id) {
        const parcels = JSON.parse(localStorage.getItem('parcels'));
        const parcel = parcels.find(p => p.id === id);
        
        if (parcel) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Parcel Details</h3>
                    <p><strong>ID:</strong> ${parcel.id}</p>
                    <p><strong>Receiver:</strong> ${parcel.receiverName}</p>
                    <p><strong>Pickup:</strong> ${parcel.pickup}</p>
                    <p><strong>Destination:</strong> ${parcel.destination}</p>
                    <p><strong>Status:</strong> ${parcel.status}</p>
                    <p><strong>Description:</strong> ${parcel.description}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
    };

    function showMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        document.body.appendChild(messageBox);
        
        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    // Load parcels on page load
    loadParcels();
});