import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import Main from "./pages/Main";
import OfficeList from "./pages/OfficeList";
import EmployeesList from "./pages/EmployeesList";
import CustomersList from "./pages/CustomersList";
import PaymentsList from "./pages/PaymentsList";
import ProductLinesList from "./pages/ProductLinesList";
import ProductsList from "./pages/ProductsList";
import OrdersList from "./pages/OrdersList";
import OrderDetailsList from "./pages/OrderDetailsList";

export default function App() {
  return (
    <Router>
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 ml-64 min-h-screen bg-gray-100 w-full">
          <Topbar />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/office" element={<OfficeList />} />
              <Route path="/employees" element={<EmployeesList />} />
              <Route path="/customers" element={<CustomersList />} />
              <Route path="/payments" element={<PaymentsList />} />
              <Route path="/productlines" element={<ProductLinesList />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/orderdetails" element={<OrderDetailsList />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}