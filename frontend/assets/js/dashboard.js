document.addEventListener("DOMContentLoaded", async () => {
    const sentParcelsTable = document.querySelector("#sent-parcels tbody");
    const receivedParcelsTable = document.querySelector("#received-parcels tbody");
    const searchSent = document.getElementById("search-sent");
    const searchReceived = document.getElementById("search-received");
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
        sentParcelsTable.innerHTML = "";
        receivedParcelsTable.innerHTML = "";

        parcels.forEach(parcel => {
            const row = `<tr>
                <td>${parcel.id}</td>
                <td>${parcel.receiver_name || parcel.sender_name}</td>
                <td>${parcel.pickup}</td>
                <td>${parcel.destination}</td>
                <td>${parcel.status}</td>
            </tr>`;

            if (parcel.sender_id === userId) {
                sentParcelsTable.innerHTML += row;
            } else {
                receivedParcelsTable.innerHTML += row;
            }
        });
    }

    searchSent.addEventListener("input", (e) => {
        filterTable("#sent-parcels tbody", e.target.value);
    });

    searchReceived.addEventListener("input", (e) => {
        filterTable("#received-parcels tbody", e.target.value);
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
