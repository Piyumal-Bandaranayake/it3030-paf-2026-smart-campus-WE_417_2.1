import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/Resources/ResourceList";
import UserResourceList from "./pages/Resources/UserResourceList";
import EquipmentList from "./pages/Resources/EquipmentList";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import RaiseTicketButton from "./components/RaiseTicketButton";

/** Returns true when a user session exists in sessionStorage */
function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(
    () => !!sessionStorage.getItem("user")
  );

  useEffect(() => {
    // Re-check whenever another tab changes sessionStorage
    const onStorage = (e) => {
      if (e.key === "user") setLoggedIn(!!e.newValue);
    };

    // Re-check on in-tab login / logout (dispatched by Login.jsx & logout handlers)
    const onAuthChange = () => setLoggedIn(!!sessionStorage.getItem("user"));

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onAuthChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onAuthChange);
    };
  }, []);

  return loggedIn;
}

function App() {
  const isLoggedIn = useIsLoggedIn();
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const saved = sessionStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const showTicketButton = isLoggedIn && user?.role !== "ADMIN";

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

      {/* Floating ticket button — only for regular users */}
      {showTicketButton && <RaiseTicketButton />}
    </BrowserRouter>
  );
}

export default App;

