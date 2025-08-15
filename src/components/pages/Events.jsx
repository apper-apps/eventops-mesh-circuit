import React, { useState } from "react";
import { motion } from "framer-motion";
import EventFilters from "@/components/organisms/EventFilters";
import EventList from "@/components/organisms/EventList";
import CreateEventForm from "@/components/organisms/CreateEventForm";
import { useFilters } from "@/contexts/FilterContext";

const Events = () => {
  const { globalFilters, getFilteredData } = useFilters();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localFilters, setLocalFilters] = useState({
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
      className="space-y-4 sm:space-y-6 max-w-full"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestión de Eventos</h1>
        <p className="text-slate-400 text-sm sm:text-base">Administra todos tus eventos desde un solo lugar</p>
      </div>

      <EventFilters
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onCreateEvent={handleCreateEvent}
        globalFilters={globalFilters}
      />

      <EventList
        filters={{ ...localFilters, ...globalFilters }}
        onEventClick={handleEventClick}
        onCreateEvent={handleCreateEvent}
        getFilteredData={getFilteredData}
      />
    </motion.div>
  );
};

export default Events;