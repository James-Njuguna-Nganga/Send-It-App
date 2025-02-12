import AuthService from './services/authService.js';
import EmailService from './services/emailService.js';
import { handleError } from './services/errorHandler.js';

document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        window.location.href = "register.html";
        return;
    }

    const isAdmin = currentUser.role === "1";
    
    const elements = {
        sentParcelsTable: document.querySelector("#sent-parcels tbody"),
        receivedParcelsTable: document.querySelector("#received-parcels tbody"),
        searchSent: document.getElementById("search-sent"),
        searchReceived: document.getElementById("search-received"),
        logoutBtn: document.getElementById("logout-btn"),
        newParcelForm: document.getElementById("new-parcel-form"),
        loadingElement: document.getElementById("loading"),
        errorElement: document.getElementById("error-message"),
        adminControls: document.querySelectorAll(".admin-only")
    };
elements.adminControls.forEach(control => {
    control.style.display = isAdmin ? 'block' : 'none';
});

if (!isAdmin) {
    const crudElements = document.querySelectorAll('.btn-edit, .btn-delete, #new-parcel-form');
    crudElements.forEach(element => {
        element.style.display = 'none';
    });
}

    function showMessage(message, type = 'info') {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
    
    function showMessage(message, type = 'info') {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
    
    
    function editParcel(id) {
        if (!isAdmin) {
            showMessage('Only admins can edit parcels', 'error');
            return;
        }
    
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const cells = row.getElementsByTagName("td");
        
        [1, 2, 3].forEach(index => {
            cells[index].contentEditable = true;
            cells[index].classList.add('editable');
        });
    
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.className = 'btn-save';
        
        saveButton.onclick = function() {
            const updatedData = {
                receiverName: cells[1].innerText,
                pickup: cells[2].innerText,
                destination: cells[3].innerText
            };
    
            fetch(`/api/parcels/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Update failed');
                showMessage('Parcel updated successfully', 'success');
                fetchParcels();
            })
            .catch(error => {
                showMessage(error.message, 'error');
            });
        };
    
        row.appendChild(saveButton);
    }
    
    function deleteParcel(id) {
        if (!isAdmin) {
            showMessage('Only admins can delete parcels', 'error');
            return;
        }
    
        const confirmDelete = confirm('Are you sure you want to delete this parcel?');
        if (!confirmDelete) return;
    
        fetch(`/api/parcels/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Delete failed');
            showMessage('Parcel deleted successfully', 'success');
            fetchParcels();
        })
        .catch(error => {
            showMessage(error.message, 'error');
        });
    }
    function viewParcelDetails(id) {
        fetch(`/api/parcels/${id}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to load parcel details');
            return response.json();
        })
        .then(parcel => {
            const detailsModal = document.createElement('div');
            detailsModal.className = 'modal';
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <h3>Parcel Details</h3>
                    <p><strong>ID:</strong> ${parcel.id}</p>
                    <p><strong>Receiver:</strong> ${parcel.receiverName}</p>
                    <p><strong>Pickup:</strong> ${parcel.pickup}</p>
                    <p><strong>Destination:</strong> ${parcel.destination}</p>
                    <p><strong>Status:</strong> ${parcel.status}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            document.body.appendChild(detailsModal);
        })
        .catch(error => {
            showMessage(error.message, 'error');
        });
    }
    
    await fetchParcels();
});