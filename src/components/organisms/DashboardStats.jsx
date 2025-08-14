import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import eventService from "@/services/api/eventService";

const DashboardStats = () => {
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
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const calculateStats = () => {
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === "Activo").length;
    const plannedEvents = events.filter(e => e.status === "Planificado").length;
    const totalAttendance = events.reduce((sum, event) => sum + event.estimatedAttendance, 0);

    return {
      totalEvents,
      activeEvents,
      plannedEvents,
      totalAttendance
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} />;
  }

  const stats = calculateStats();

  const statsData = [
    {
      title: "Total de Eventos",
      value: stats.totalEvents,
      icon: "Calendar",
      color: "primary",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Eventos Activos",
      value: stats.activeEvents,
      icon: "Play",
      color: "success",
      trend: "up",
      trendValue: "+8%"
    },
    {
      title: "En Planificación",
      value: stats.plannedEvents,
      icon: "Clock",
      color: "info",
      trend: "up",
      trendValue: "+15%"
    },
    {
      title: "Asistencia Total",
      value: stats.totalAttendance.toLocaleString(),
      icon: "Users",
      color: "warning",
      trend: "up",
      trendValue: "+25%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;