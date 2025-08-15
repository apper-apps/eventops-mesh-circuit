import eventsData from "@/services/mockData/events.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EventService {
  constructor() {
    this.events = [...eventsData];
  }

async getAll(user = null) {
    await delay(300);
    let events = [...this.events];
    
    // Apply user-based filtering if user context provided
    if (user) {
      if (user.role === 'entrepreneur') {
        events = events.filter(event => 
          user.assignedEventIds && user.assignedEventIds.includes(event.Id)
        );
      }
      // SaaS admin and owners see all events
    }
    
    return events;
  }

  async getById(id) {
    await delay(200);
    const event = this.events.find(event => event.Id === parseInt(id));
    if (!event) {
      throw new Error(`Evento con ID ${id} no encontrado`);
    }
    return { ...event };
  }

async create(eventData) {
    await delay(400);
    
    const newId = Math.max(...this.events.map(e => e.Id), 0) + 1;
    const newEvent = {
      Id: newId,
      ...eventData,
      estimatedTables: eventData.estimatedTables || 0,
      entrepreneur: eventData.entrepreneur || "",
      dealType: eventData.dealType || "",
      customTickets: eventData.customTickets || null,
      customBars: eventData.customBars || null,
      createdAt: new Date().toISOString()
    };
    
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, eventData) {
    await delay(350);
    
    const index = this.events.findIndex(event => event.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Evento con ID ${id} no encontrado`);
    }
    
    this.events[index] = { ...this.events[index], ...eventData };
    return { ...this.events[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.events.findIndex(event => event.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Evento con ID ${id} no encontrado`);
    }
    
    const deletedEvent = this.events.splice(index, 1)[0];
    return { ...deletedEvent };
  }

  async getByStatus(status) {
    await delay(200);
    return this.events.filter(event => event.status === status);
  }

  async getByType(eventType) {
    await delay(200);
    return this.events.filter(event => event.eventType === eventType);
  }
}

export default new EventService();