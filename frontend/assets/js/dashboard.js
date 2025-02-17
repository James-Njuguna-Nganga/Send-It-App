document.addEventListener("DOMContentLoaded", async () => {
    // Check authentication
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        window.location.href = "login.html";
        return;
    }

    const elements = {
        userName: document.getElementById("user-name"),
        logoutBtn: document.getElementById("logout-btn"),
        adminControls: document.getElementById("admin-controls"),
        sentParcelsTable: document.querySelector("#sent-parcels tbody"),
        newParcelForm: document.getElementById("new-parcel-form"),
        totalParcels: document.getElementById("total-parcels"),
        inTransit: document.getElementById("in-transit"),
        delivered: document.getElementById("delivered"),
        searchSent: document.getElementById("search-sent"),
        modalContainer: document.getElementById("modal-container")
    };

    // Initialize dashboard
    await initializeDashboard();

    // Event Listeners
    elements.logoutBtn.addEventListener("click", handleLogout);
    elements.searchSent?.addEventListener("input", handleSearch);
    elements.newParcelForm?.addEventListener("submit", handleNewParcel);

    async function initializeDashboard() {
        try {
            elements.userName.textContent = `Welcome, ${user.name}`;

            if (user.isAdmin) {
                elements.adminControls?.classList.remove("hidden");
                await loadAllParcels();
            } else {
                await loadUserParcels();
            }
        } catch (error) {
            console.error("Dashboard initialization error:", error);
            showMessage("Error initializing dashboard", "error");
        }
    }

    async function loadAllParcels() {
        try {
            const response = await fetch("http://localhost:5000/api/parcels/all", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch parcels');
            }

            const data = await response.json();
            if (!data.data) throw new Error('No parcel data received');

            updateDashboardStats(data.data);
            displayParcels(data.data);
        } catch (error) {
            console.error("Load parcels error:", error);
            showMessage("Error loading parcels: " + error.message, "error");
        }
    }

    async function loadUserParcels() {
        try {
            const response = await fetch("http://localhost:5000/api/parcels/user", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch parcels');
            }

            const data = await response.json();
            if (!data.data) throw new Error('No parcel data received');

            displayParcels(data.data);
        } catch (error) {
            console.error("Load user parcels error:", error);
            showMessage("Error loading parcels: " + error.message, "error");
        }
    }

    async function handleNewParcel(e) {
        e.preventDefault();

        try {
            const formData = {
                pickupLocation: e.target.pickup.value.trim(),
                destination: e.target.destination.value.trim(),
                receiverEmail: e.target.receiver_email.value.trim()
            };

            if (!formData.pickupLocation || !formData.destination || !formData.receiverEmail) {
                throw new Error('Please fill in all fields');
            }

            const response = await fetch("http://localhost:5000/api/parcels", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create parcel');
            }

            showMessage("Parcel created successfully!", "success");
            e.target.reset();
            
            if (user.isAdmin) {
                await loadAllParcels();
            } else {
                await loadUserParcels();
            }
        } catch (error) {
            console.error("Create parcel error:", error);
            showMessage(error.message, "error");
        }
    }
    window.viewParcel = async (id) => {
        try {
            showMessage("Loading parcel details...", "info");
            
            if (!id) {
                throw new Error('Invalid parcel ID');
            }
    
            const response = await fetch(`http://localhost:5000/api/parcels/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            console.log();
            
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch parcel details');
            }
    
            if (!data.data) {
                throw new Error('Parcel not found');
            }
    
            closeModal();
            showParcelModal(data.data);
    
        } catch (error) {
            console.error("View parcel error:", error);
            showMessage("Error viewing parcel: " + error.message, "error");
        }
    };

// Update the showParcelModal function
function showParcelModal(parcel) {
    // Validate parcel data
    if (!parcel || !parcel.ParcelID) {
        showMessage("Invalid parcel data", "error");
        return;
    }

    const modalHTML = `
        <div class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Parcel Details</h2>
                <div class="parcel-details">
                    <p><strong>Parcel ID:</strong> ${parcel.ParcelID || 'N/A'}</p>
                    <p><strong>Sender:</strong> ${parcel.SenderName || 'N/A'}</p>
                    <p><strong>Pickup Location:</strong> ${parcel.PickupLocation || 'N/A'}</p>
                    <p><strong>Destination:</strong> ${parcel.Destination || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                        <span class="status-badge status-${(parcel.Status || 'pending').toLowerCase().replace(' ', '-')}">
                            ${parcel.Status || 'Pending'}
                        </span>
                    </p>
                    <p><strong>Receiver Email:</strong> ${parcel.ReceiverEmail || 'N/A'}</p>
                    <p><strong>Created:</strong> ${parcel.CreatedAt ? new Date(parcel.CreatedAt).toLocaleString() : 'N/A'}</p>
                    ${parcel.UpdatedAt ? `
                        <p><strong>Last Updated:</strong> ${new Date(parcel.UpdatedAt).toLocaleString()}</p>
                    ` : ''}
                </div>
                ${user.isAdmin ? `
                    <div class="status-update">
                        <h3>Update Status</h3>
                        <select id="statusSelect" class="form-control">
                            <option value="Pending" ${parcel.Status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In Transit" ${parcel.Status === 'In Transit' ? 'selected' : ''}>In Transit</option>
                            <option value="Delivered" ${parcel.Status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                        <button onclick="updateParcelStatus(${parcel.ParcelID})" class="btn-primary">
                            <i class="fas fa-save"></i> Update Status
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add modal to DOM
    elements.modalContainer.innerHTML = modalHTML;

    // Get modal elements
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close');

    // Add event listeners
    closeBtn.onclick = closeModal;
    window.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    // Add this function to handle payment success
function showPaymentSuccess(parcelId) {
    const template = document.getElementById('payment-success-template');
    const modalContainer = document.getElementById('modal-container');
    
    modalContainer.innerHTML = template.innerHTML;
    modalContainer.classList.add('active');
    
    const parcelIdSpan = modalContainer.querySelector('#parcelId');
    if (parcelIdSpan) {
        parcelIdSpan.textContent = parcelId;
    }
}

// Add this to your existing code
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    modalContainer.innerHTML = '';
}

// Update your payment handling
window.initiatePayment = async (parcelId) => {
    try {
        // ... existing payment code ...
        
        if (response.ok) {
            showPaymentSuccess(parcelId);
            await loadParcels(); // Refresh parcel list
        }
        
        // ... rest of the code ...
    } catch (error) {
        console.error("Payment error:", error);
        showMessage("Payment error: " + error.message, "error");
    }
};
}

    function updateDashboardStats(parcels) {
        if (!user.isAdmin) return;

        const stats = parcels.reduce((acc, parcel) => {
            acc.total++;
            if (parcel.Status === 'In Transit') acc.inTransit++;
            if (parcel.Status === 'Delivered') acc.delivered++;
            return acc;
        }, { total: 0, inTransit: 0, delivered: 0 });

        elements.totalParcels.textContent = stats.total;
        elements.inTransit.textContent = stats.inTransit;
        elements.delivered.textContent = stats.delivered;
    }

    function displayParcels(parcels) {
        if (!elements.sentParcelsTable) return;

        elements.sentParcelsTable.innerHTML = '';

        if (!parcels.length) {
            elements.sentParcelsTable.innerHTML = `
                <tr><td colspan="5" class="no-data">No parcels found</td></tr>
            `;
            return;
        }

        parcels.forEach(parcel => {
            const row = createParcelRow(parcel);
            elements.sentParcelsTable.appendChild(row);
        });
    }

    function createParcelRow(parcel) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${parcel.ParcelID}</td>
            <td>${parcel.PickupLocation}</td>
            <td>${parcel.Destination}</td>
            <td><span class="status-badge status-${parcel.Status.toLowerCase().replace(' ', '-')}">${parcel.Status}</span></td>
            <td>
                <button onclick="viewParcel(${parcel.ParcelID})" class="btn-primary">
                    <i class="fas fa-eye"></i> View
                </button>
                ${user.isAdmin ? `
                    <button onclick="updateParcelStatus(${parcel.ParcelID})" class="btn-primary">
                        <i class="fas fa-edit"></i> Update
                    </button>
                ` : ''}
                ${parcel.Status === 'Pending' ? `
                    <button onclick="cancelParcel(${parcel.ParcelID})" class="btn-danger">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
            </td>
        `;
        return row;
    }

    function showMessage(message, type = "info") {
        const messageBox = document.createElement("div");
        messageBox.className = `message ${type}`;
        messageBox.textContent = message;
        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.remove(), 3000);
    }

    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = elements.sentParcelsTable.getElementsByTagName("tr");
        
        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? "" : "none";
        });
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }
});

