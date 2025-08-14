import React, { useState } from "react";
import { motion } from "framer-motion";
import EventFilters from "@/components/organisms/EventFilters";
import EventList from "@/components/organisms/EventList";
import CreateEventForm from "@/components/organisms/CreateEventForm";

const Events = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all"
  });

  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    // The EventList component will automatically refresh
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <CreateEventForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Eventos</h1>
        <p className="text-slate-400">Administra todos tus eventos desde un solo lugar</p>
      </div>

      <EventFilters
        filters={filters}
        onFiltersChange={setFilters}
        onCreateEvent={handleCreateEvent}
      />

      <EventList
        filters={filters}
        onEventClick={handleEventClick}
        onCreateEvent={handleCreateEvent}
      />
    </motion.div>
  );
};

export default Events;