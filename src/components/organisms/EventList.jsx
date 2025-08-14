import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/molecules/EventCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import eventService from "@/services/api/eventService";

const EventList = ({ filters, onEventClick, onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      setError("Error al cargar los eventos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (filters.status && filters.status !== "all" && event.status !== filters.status) {
      return false;
    }
    if (filters.type && filters.type !== "all" && event.eventType !== filters.type) {
      return false;
    }
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <Loading className="py-12" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} className="py-12" />;
  }

  if (filteredEvents.length === 0) {
    return (
      <Empty
        icon="Calendar"
        title="No se encontraron eventos"
        description="No hay eventos que coincidan con los filtros aplicados o aún no has creado ningún evento."
        action={onCreateEvent}
        actionText="Crear mi primer evento"
        className="py-12"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredEvents.map((event, index) => (
        <motion.div
          key={event.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EventCard 
            event={event} 
            onClick={() => onEventClick(event)} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default EventList;