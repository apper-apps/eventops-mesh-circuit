import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/organisms/Layout";
import VipReservations from "@/components/pages/VipReservations";
import Events from "@/components/pages/Events";
import FinancialAccounts from "@/components/pages/FinancialAccounts";
import Dashboard from "@/components/pages/Dashboard";
import Budgets from "@/components/pages/Budgets";
import BarInventory from "@/components/pages/BarInventory";
import Login from "@/components/pages/Login";
import eventsData from "@/services/mockData/events.json";
import vipReservationsData from "@/services/mockData/vipReservations.json";
import financialAccountsData from "@/services/mockData/financialAccounts.json";
import budgetsData from "@/services/mockData/budgets.json";
import accountTransactionsData from "@/services/mockData/accountTransactions.json";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;