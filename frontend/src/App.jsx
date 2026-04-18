import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/Resources/ResourceList";
import UserResourceList from "./pages/Resources/UserResourceList";
import EquipmentList from "./pages/Resources/EquipmentList";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<ResourceList />} />
        <Route path="/user/resources" element={<UserResourceList />} />
        <Route path="/equipment" element={<EquipmentList />} />
        {/* Marketing / landing dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Logged-in user dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        {/* Admin dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
