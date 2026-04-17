import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/Resources/ResourceList";
import UserResourceList from "./pages/Resources/UserResourceList";
import EquipmentList from "./pages/Resources/EquipmentList";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/user/resources" element={<UserResourceList />} />
          <Route path="/equipment" element={<EquipmentList />} />
       
        {/* Public login page */}
        <Route path="/" element={<Login />} />
        {/* Marketing / landing dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Logged-in user dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
