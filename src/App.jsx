import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Events from "@/components/pages/Events";
import Budgets from "@/components/pages/Budgets";
import VipReservations from "@/components/pages/VipReservations";
import BarInventory from "@/components/pages/BarInventory";
import FinancialAccounts from "@/components/pages/FinancialAccounts";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="vip-reservations" element={<VipReservations />} />
            <Route path="bar-inventory" element={<BarInventory />} />
            <Route path="financial-accounts" element={<FinancialAccounts />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;