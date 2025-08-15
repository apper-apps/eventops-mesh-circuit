import { toast } from 'react-toastify';

class EventService {
  constructor() {
    this.tableName = 'event_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll(user = null) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "venue_c" } },
          { field: { Name: "event_type_c" } },
          { field: { Name: "estimated_attendance_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_tables_c" } },
          { field: { Name: "entrepreneur_c" } },
          { field: { Name: "deal_type_c" } },
          { field: { Name: "custom_tickets_c" } },
          { field: { Name: "custom_bars_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching events:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(event => ({
        Id: event.Id,
        name: event.Name,
        title: event.title_c,
        date: event.date_c,
        venue: event.venue_c,
        eventType: event.event_type_c,
        estimatedAttendance: event.estimated_attendance_c,
        status: event.status_c,
        estimatedTables: event.estimated_tables_c,
        entrepreneur: event.entrepreneur_c,
        dealType: event.deal_type_c,
        customTickets: event.custom_tickets_c,
        customBars: event.custom_bars_c,
        createdAt: event.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching events:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching events:", error.message);
        toast.error("Error loading events");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "venue_c" } },
          { field: { Name: "event_type_c" } },
          { field: { Name: "estimated_attendance_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_tables_c" } },
          { field: { Name: "entrepreneur_c" } },
          { field: { Name: "deal_type_c" } },
          { field: { Name: "custom_tickets_c" } },
          { field: { Name: "custom_bars_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const event = response.data;
      return {
        Id: event.Id,
        name: event.Name,
        title: event.title_c,
        date: event.date_c,
        venue: event.venue_c,
        eventType: event.event_type_c,
        estimatedAttendance: event.estimated_attendance_c,
        status: event.status_c,
        estimatedTables: event.estimated_tables_c,
        entrepreneur: event.entrepreneur_c,
        dealType: event.deal_type_c,
        customTickets: event.custom_tickets_c,
        customBars: event.custom_bars_c,
        createdAt: event.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching event with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching event:", error.message);
        toast.error("Error loading event");
      }
      return null;
    }
  }

  async create(eventData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Name: eventData.title || eventData.name,
          Tags: eventData.tags || "",
          title_c: eventData.title,
          date_c: eventData.date,
          venue_c: eventData.venue,
          event_type_c: eventData.eventType,
          estimated_attendance_c: parseInt(eventData.estimatedAttendance) || 0,
          status_c: eventData.status || "Planificado",
          estimated_tables_c: parseInt(eventData.estimatedTables) || 0,
          entrepreneur_c: eventData.entrepreneur || "",
          deal_type_c: eventData.dealType || "",
          custom_tickets_c: eventData.customTickets ? parseFloat(eventData.customTickets) : null,
          custom_bars_c: eventData.customBars ? parseFloat(eventData.customBars) : null,
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating event:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create event ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Event created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating event:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating event:", error.message);
        toast.error("Error creating event");
      }
      return null;
    }
  }

  async update(id, eventData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: eventData.title || eventData.name,
          Tags: eventData.tags || "",
          title_c: eventData.title,
          date_c: eventData.date,
          venue_c: eventData.venue,
          event_type_c: eventData.eventType,
          estimated_attendance_c: parseInt(eventData.estimatedAttendance) || 0,
          status_c: eventData.status,
          estimated_tables_c: parseInt(eventData.estimatedTables) || 0,
          entrepreneur_c: eventData.entrepreneur || "",
          deal_type_c: eventData.dealType || "",
          custom_tickets_c: eventData.customTickets ? parseFloat(eventData.customTickets) : null,
          custom_bars_c: eventData.customBars ? parseFloat(eventData.customBars) : null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating event:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update event ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Event updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating event:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating event:", error.message);
        toast.error("Error updating event");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting event:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete event ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Event deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting event:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting event:", error.message);
        toast.error("Error deleting event");
      }
      return false;
    }
  }

  async getByStatus(status) {
    const allEvents = await this.getAll();
    return allEvents.filter(event => event.status === status);
  }

  async getByType(eventType) {
    const allEvents = await this.getAll();
    return allEvents.filter(event => event.eventType === eventType);
  }
}
export default new EventService();