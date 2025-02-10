function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: -1.286389, lng: 36.817223 }
    });

    fetch("http://localhost:5000/api/parcels")
        .then(response => response.json())
        .then(parcels => {
            parcels.forEach(parcel => {
                new google.maps.Marker({
                    position: { lat: parcel.pickup_lat, lng: parcel.pickup_lng },
                    map,
                    title: "Pickup Location"
                });

                new google.maps.Marker({
                    position: { lat: parcel.dest_lat, lng: parcel.dest_lng },
                    map,
                    title: "Destination"
                });
            });
        })
        .catch(error => console.error("Error loading map data", error));
}
