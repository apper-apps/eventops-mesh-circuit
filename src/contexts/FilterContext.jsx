import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from '@/services/api/eventService';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [globalFilters, setGlobalFilters] = useState({
    selectedEventId: 'all',
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear()
  });

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await eventService.getAll();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    loadEvents();
  }, []);

  const updateGlobalFilters = (newFilters) => {
    setGlobalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setGlobalFilters({
      selectedEventId: 'all',
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear()
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    if (globalFilters.selectedEventId !== 'all') count++;
    if (globalFilters.selectedMonth !== currentMonth || globalFilters.selectedYear !== currentYear) count++;
    
    return count;
  };

  const getSelectedEvent = () => {
    if (globalFilters.selectedEventId === 'all') return null;
    return events.find(event => event.Id === parseInt(globalFilters.selectedEventId));
  };

  const getFilteredData = (data, additionalFilters = {}) => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(item => {
      // Event filter
      if (globalFilters.selectedEventId !== 'all') {
        if (item.Id && item.Id !== parseInt(globalFilters.selectedEventId)) return false;
        if (item.eventId && item.eventId !== parseInt(globalFilters.selectedEventId)) return false;
      }

      // Date filter
      const itemDate = new Date(item.date || item.createdAt);
      if (!isNaN(itemDate.getTime())) {
        const itemMonth = itemDate.getMonth() + 1;
        const itemYear = itemDate.getFullYear();
        
        if (itemMonth !== globalFilters.selectedMonth || itemYear !== globalFilters.selectedYear) {
          return false;
        }
      }

      // Apply additional filters
      for (const [key, value] of Object.entries(additionalFilters)) {
        if (value && value !== 'all' && item[key] !== value) {
          return false;
        }
      }

      return true;
    });
  };

  const value = {
    events,
    globalFilters,
    updateGlobalFilters,
    resetFilters,
    getActiveFiltersCount,
    getSelectedEvent,
    getFilteredData
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};