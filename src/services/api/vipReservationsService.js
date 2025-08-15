import { toast } from 'react-toastify';

class VipReservationsService {
  constructor() {
    this.tableName = 'vip_reservation_c';
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

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "table_number_c" } },
          { field: { Name: "event_c" } },
          { field: { Name: "client_name_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "table_type_c" } },
          { field: { Name: "total_price_c" } },
          { field: { Name: "advance_paid_c" } },
          { field: { Name: "pending_balance_c" } },
          { field: { Name: "payment_method_c" } },
          { field: { Name: "responsible_person_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "origin_c" } },
          { field: { Name: "creation_date_c" } },
          { field: { Name: "last_payment_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching VIP reservations:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(reservation => ({
        Id: reservation.Id,
        name: reservation.Name,
        tableNumber: reservation.table_number_c,
        event: reservation.event_c,
        clientName: reservation.client_name_c,
        phone: reservation.phone_c,
        email: reservation.email_c,
        tableType: reservation.table_type_c,
        totalPrice: reservation.total_price_c,
        advancePaid: reservation.advance_paid_c,
        pendingBalance: reservation.pending_balance_c,
        paymentMethod: reservation.payment_method_c,
        responsiblePerson: reservation.responsible_person_c,
        status: reservation.status_c,
        origin: reservation.origin_c,
        creationDate: reservation.creation_date_c,
        lastPaymentDate: reservation.last_payment_date_c,
        notes: reservation.notes_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching VIP reservations:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching VIP reservations:", error.message);
        toast.error("Error loading VIP reservations");
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
          { field: { Name: "table_number_c" } },
          { field: { Name: "event_c" } },
          { field: { Name: "client_name_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "table_type_c" } },
          { field: { Name: "total_price_c" } },
          { field: { Name: "advance_paid_c" } },
          { field: { Name: "pending_balance_c" } },
          { field: { Name: "payment_method_c" } },
          { field: { Name: "responsible_person_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "origin_c" } },
          { field: { Name: "creation_date_c" } },
          { field: { Name: "last_payment_date_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const reservation = response.data;
      return {
        Id: reservation.Id,
        name: reservation.Name,
        tableNumber: reservation.table_number_c,
        event: reservation.event_c,
        clientName: reservation.client_name_c,
        phone: reservation.phone_c,
        email: reservation.email_c,
        tableType: reservation.table_type_c,
        totalPrice: reservation.total_price_c,
        advancePaid: reservation.advance_paid_c,
        pendingBalance: reservation.pending_balance_c,
        paymentMethod: reservation.payment_method_c,
        responsiblePerson: reservation.responsible_person_c,
        status: reservation.status_c,
        origin: reservation.origin_c,
        creationDate: reservation.creation_date_c,
        lastPaymentDate: reservation.last_payment_date_c,
        notes: reservation.notes_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching VIP reservation with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching VIP reservation:", error.message);
        toast.error("Error loading VIP reservation");
      }
      return null;
    }
  }

  async create(reservationData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Name: reservationData.clientName || `VIP-${Date.now()}`,
          Tags: reservationData.tags || "",
          table_number_c: reservationData.tableNumber,
          event_c: reservationData.event,
          client_name_c: reservationData.clientName,
          phone_c: reservationData.phone,
          email_c: reservationData.email || "",
          table_type_c: reservationData.tableType,
          total_price_c: parseFloat(reservationData.totalPrice) || 0,
          advance_paid_c: parseFloat(reservationData.advancePaid) || 0,
          pending_balance_c: parseFloat(reservationData.pendingBalance) || 0,
          payment_method_c: reservationData.paymentMethod || "",
          responsible_person_c: reservationData.responsiblePerson || "",
          status_c: reservationData.status || "Pending",
          origin_c: reservationData.origin || "",
          creation_date_c: new Date().toISOString(),
          last_payment_date_c: reservationData.advancePaid && reservationData.advancePaid > 0 ? new Date().toISOString() : null,
          notes_c: reservationData.notes || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating VIP reservation:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create VIP reservation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("VIP reservation created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating VIP reservation:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating VIP reservation:", error.message);
        toast.error("Error creating VIP reservation");
      }
      return null;
    }
  }

  async update(id, reservationData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: reservationData.clientName || `VIP-${id}`,
          Tags: reservationData.tags || "",
          table_number_c: reservationData.tableNumber,
          event_c: reservationData.event,
          client_name_c: reservationData.clientName,
          phone_c: reservationData.phone,
          email_c: reservationData.email || "",
          table_type_c: reservationData.tableType,
          total_price_c: parseFloat(reservationData.totalPrice) || 0,
          advance_paid_c: parseFloat(reservationData.advancePaid) || 0,
          pending_balance_c: parseFloat(reservationData.pendingBalance) || 0,
          payment_method_c: reservationData.paymentMethod || "",
          responsible_person_c: reservationData.responsiblePerson || "",
          status_c: reservationData.status,
          origin_c: reservationData.origin || "",
          last_payment_date_c: reservationData.advancePaid ? new Date().toISOString() : null,
          notes_c: reservationData.notes || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating VIP reservation:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update VIP reservation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("VIP reservation updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating VIP reservation:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating VIP reservation:", error.message);
        toast.error("Error updating VIP reservation");
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
        console.error("Error deleting VIP reservation:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete VIP reservation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("VIP reservation deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting VIP reservation:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting VIP reservation:", error.message);
        toast.error("Error deleting VIP reservation");
      }
      return false;
    }
  }

  async getByStatus(status) {
    const allReservations = await this.getAll();
    return allReservations.filter(r => r.status === status);
  }

  async getByTableType(tableType) {
    const allReservations = await this.getAll();
    return allReservations.filter(r => r.tableType === tableType);
  }

  async getByResponsible(responsiblePerson) {
    const allReservations = await this.getAll();
    return allReservations.filter(r => r.responsiblePerson === responsiblePerson);
  }

  async search(query) {
    const allReservations = await this.getAll();
    const searchTerm = query.toLowerCase();
    return allReservations.filter(r => 
      r.clientName?.toLowerCase().includes(searchTerm) ||
      r.event?.toLowerCase().includes(searchTerm) ||
      r.email?.toLowerCase().includes(searchTerm) ||
      r.phone?.includes(query)
    );
  }
}

// Export singleton instance
export default new VipReservationsService();