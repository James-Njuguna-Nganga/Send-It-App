document.addEventListener("DOMContentLoaded", async () => {
    const parcelTable = document.querySelector("#parcel-table tbody");
    const searchParcel = document.getElementById("search-parcel");
    const parcelForm = document.getElementById("parcel-form");
    const logoutBtn = document.getElementById("logout-btn");

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "dashboard.html";
    }

    async function fetchParcels() {
        try {
            const response = await fetch("http://localhost:5000/api/parcels", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const parcels = await response.json();
            displayParcels(parcels);
        } catch (error) {
            console.error("Error fetching parcels", error);
        }
    }

    function displayParcels(parcels) {
        parcelTable.innerHTML = "";

        parcels.forEach(parcel => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${parcel.id}</td>
                <td>${parcel.sender_name}</td>
                <td>${parcel.receiver_name}</td>
                <td>${parcel.pickup}</td>
                <td>${parcel.destination}</td>
                <td>
                    <select class="status-dropdown" data-id="${parcel.id}">
                        <option value="Pending" ${parcel.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Transit" ${parcel.status === "In Transit" ? "selected" : ""}>In Transit</option>
                        <option value="Delivered" ${parcel.status === "Delivered" ? "selected" : ""}>Delivered</option>
                    </select>
                </td>
                <td><button class="update-btn" data-id="${parcel.id}">Update</button></td>
            `;

            parcelTable.appendChild(row);
        });

        document.querySelectorAll(".update-btn").forEach(button => {
            button.addEventListener("click", updateStatus);
        });
    }

    async function updateStatus(e) {
        const parcelId = e.target.dataset.id;
        const statusDropdown = document.querySelector(`.status-dropdown[data-id="${parcelId}"]`);
        const newStatus = statusDropdown.value;

        try {
            const response = await fetch(`http://localhost:5000/api/parcels/${parcelId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();
            console.log("Status updated:", result);
            fetchParcels();
        } catch (error) {
            console.error("Error updating status", error);
        }
    }

    parcelForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            sender: document.getElementById("sender").value,
            sender_email: document.getElementById("sender-email").value,
            receiver: document.getElementById("receiver").value,
            receiver_email: document.getElementById("receiver-email").value,
            pickup: document.getElementById("pickup").value,
            destination: document.getElementById("destination").value
        };

        try {
            const response = await fetch("http://localhost:5000/api/parcels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("Parcel created:", result);
            fetchParcels();
        } catch (error) {
            console.error("Error creating parcel", error);
        }
    });

    searchParcel.addEventListener("input", (e) => {
        filterTable("#parcel-table tbody", e.target.value);
    });

    function filterTable(tableSelector, searchValue) {
        const rows = document.querySelectorAll(`${tableSelector} tr`);
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(searchValue.toLowerCase()) ? "" : "none";
        });
    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    fetchParcels();
});
