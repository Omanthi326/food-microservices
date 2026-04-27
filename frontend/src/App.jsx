import Admin from "./pages/Admin";
import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useLocation } from "react-router-dom";
import CreateFood from "./pages/CreateFood";
import EditFood from "./pages/EditFood";
import DeleteFood from "./pages/DeleteFood";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminNavbar from "./pages/AdminNavbar";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import ModernFooter from "./components/ModernFooter";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Dashboard from "./pages/Dashboard";
import DeleteOrder from "./pages/DeleteOrder";
import OrderStatus from "./pages/OrderStatus";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
    {isAdminRoute ? <AdminNavbar/> : <Navbar/>}
    <div className={isAdminRoute ? 'pt-20' : 'pt-20'}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order-confirmation" element={<OrderConfirmation/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/success" element={<Success/>} />
        <Route path="/cancel" element={<Cancel/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/order-status" element={<OrderStatus/>} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes/>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ModernFooter/>
    </div>

    </>
  );
};


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="
      " element={<DeleteOrder/>} />
      <Route path="/food/create" element={<CreateFood/>} />
      <Route path="/food/edit/:id" element={<EditFood/>} />
      <Route path="/food/delete/:id" element={<DeleteFood/>} />
    </Routes>
  );
};

export default App;