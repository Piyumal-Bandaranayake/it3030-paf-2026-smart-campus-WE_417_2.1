import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/Resources/ResourceList";
import UserResourceList from "./pages/Resources/UserResourceList";
import EquipmentList from "./pages/Resources/EquipmentList";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/user/resources" element={<UserResourceList />} />
          <Route path="/equipment" element={<EquipmentList />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
