import "./custom.css";
import "./styles/admin.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />

            <Services showDesc={false} showFilter={false} showSearch={true} />
          </>
        } />
        <Route path="/services" element={<Services showDesc={true} showFilter={true} showSearch={true} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;