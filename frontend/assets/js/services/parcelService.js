// Define the initial parcel data structure
const initialParcels = {
    parcels: [
        {
            id: 1,
            userId: "123",
            receiverName: "John Doe",
            pickup: "Nairobi",
            destination: "Mombasa",
            status: "pending",
            description: "Fragile items"
        }
    ]
};

// Parcel service class to handle parcel operations
class ParcelService {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('parcels')) {
            localStorage.setItem('parcels', JSON.stringify(initialParcels.parcels));
        }
    }

    getAllParcels() {
        return JSON.parse(localStorage.getItem('parcels') || '[]');
    }

    addParcel(parcel) {
        const parcels = this.getAllParcels();
        parcels.push({
            ...parcel,
            id: Date.now()
        });
        localStorage.setItem('parcels', JSON.stringify(parcels));
        return parcel;
    }

    updateParcel(id, updates) {
        const parcels = this.getAllParcels();
        const index = parcels.findIndex(p => p.id === id);
        if (index !== -1) {
            parcels[index] = { ...parcels[index], ...updates };
            localStorage.setItem('parcels', JSON.stringify(parcels));
            return parcels[index];
        }
        return null;
    }

    deleteParcel(id) {
        const parcels = this.getAllParcels();
        const filteredParcels = parcels.filter(p => p.id !== id);
        localStorage.setItem('parcels', JSON.stringify(filteredParcels));
    }

    getParcelById(id) {
        const parcels = this.getAllParcels();
        return parcels.find(p => p.id === id);
    }
}

export default new ParcelService();