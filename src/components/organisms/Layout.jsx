import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
const Layout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FilterProvider>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="lg:pl-64">
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-none lg:px-8">
            {/* Header */}
            <Header 
              title="EventOps Pro"
              onMenuClick={() => setSidebarOpen(true)}
            />
          
          <main className="p-4 lg:p-8">
            <Outlet />
</main>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Layout;