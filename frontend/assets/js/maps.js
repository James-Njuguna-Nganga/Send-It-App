class ParcelMap {
    constructor(containerId) {
        this.map = new google.maps.Map(document.getElementById(containerId), {
            zoom: 12,
            center: { lat: -1.2921, lng: 36.8219 } // Default to Nairobi
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
    }

    async showRoute(pickup, destination) {
        try {
            const result = await this.directionsService.route({
                origin: pickup,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            });
            
            this.directionsRenderer.setDirections(result);
        } catch (error) {
            console.error('Error displaying route:', error);
        }
    }

    static async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                error => {
                    reject(error);
                }
            );
        });
    }
}