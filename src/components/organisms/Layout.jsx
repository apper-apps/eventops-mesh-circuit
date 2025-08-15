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
        <div className="lg:ml-64 min-h-screen flex flex-col">
          <div className="z-40">
            {/* Header */}
            <Header 
              title="EventOps Pro"
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>
          
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Layout;