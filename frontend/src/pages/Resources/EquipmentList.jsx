import React, { useState } from "react";
import BookingModal from "./BookingModal";

const EquipmentList = () => {
  const [resources] = useState([
    {
      id: 1,
      name: "Lecture Hall A",
      type: "Hall",
      capacity: 100,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Projector X",
      type: "Equipment",
      capacity: 1,
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Camera Kit",
      type: "Equipment",
      capacity: 1,
      status: "ACTIVE",
    },
  ]);

  const [selectedResource, setSelectedResource] = useState(null);

  const equipmentList = resources.filter(
    (r) => r.type === "Equipment"
  );

  return (
    <div>
      <h2>Equipment Booking</h2>

      {equipmentList.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Status: {item.status}</p>

          <button onClick={() => setSelectedResource(item)}>
            Book Equipment
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default EquipmentList;