import vipReservationsData from '@/services/mockData/vipReservations.json';

// Mock data storage (in real app, this would be a database)
let reservations = [...vipReservationsData];
let nextId = Math.max(...reservations.map(r => r.Id)) + 1;

// Utility function to simulate async operations
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class VipReservationsService {
  async getAll() {
    await delay();
    return [...reservations]; // Return copy to prevent external mutation
  }

  async getById(id) {
    if (typeof id !== 'number' || id < 1) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    const reservation = reservations.find(r => r.Id === id);
    if (!reservation) {
      throw new Error(`Reservation with ID ${id} not found`);
    }
    return { ...reservation }; // Return copy
  }

async create(reservationData) {
    await delay();
    
    // Generate new ID and ignore any ID in input data
    const newReservation = {
      ...reservationData,
      Id: nextId++,
      creationDate: new Date().toISOString(),
      lastPaymentDate: reservationData.advancePaid && reservationData.advancePaid > 0 ? new Date().toISOString() : null
    };
    
    reservations.push(newReservation);
    return { ...newReservation };
  }

  async update(id, reservationData) {
    if (typeof id !== 'number' || id < 1) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    
    const index = reservations.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error(`Reservation with ID ${id} not found`);
    }

    const updatedReservation = {
      ...reservations[index],
      ...reservationData,
      Id: id, // Preserve original ID
      lastPaymentDate: reservationData.advancePaid !== reservations[index].advancePaid ? 
        new Date().toISOString() : reservations[index].lastPaymentDate
    };
    
    reservations[index] = updatedReservation;
    return { ...updatedReservation };
  }

  async delete(id) {
    if (typeof id !== 'number' || id < 1) {
      throw new Error('ID must be a positive integer');
    }
    
    await delay();
    
    const index = reservations.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error(`Reservation with ID ${id} not found`);
    }

    const deletedReservation = reservations[index];
    reservations.splice(index, 1);
    return { ...deletedReservation };
  }

  async getByStatus(status) {
    await delay();
    return reservations.filter(r => r.status === status).map(r => ({ ...r }));
  }

  async getByTableType(tableType) {
    await delay();
    return reservations.filter(r => r.tableType === tableType).map(r => ({ ...r }));
  }

  async getByResponsible(responsiblePerson) {
    await delay();
    return reservations.filter(r => r.responsiblePerson === responsiblePerson).map(r => ({ ...r }));
  }

  async search(query) {
    await delay();
    const searchTerm = query.toLowerCase();
    return reservations.filter(r => 
      r.clientName.toLowerCase().includes(searchTerm) ||
      r.event.toLowerCase().includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm) ||
      r.phone.includes(query)
    ).map(r => ({ ...r }));
  }
}

// Export singleton instance
export default new VipReservationsService();