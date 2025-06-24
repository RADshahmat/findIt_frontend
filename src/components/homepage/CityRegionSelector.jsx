// src/components/CityRegionSelector.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import districtsData from "../../assets/bd-districts.json";

const CityRegionSelector = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const visibleDistricts = showAll
    ? districtsData.districts
    : districtsData.districts.slice(0, 30);

  return (
    <section className="p-6 mx-7  bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2  text-slate-800">
        <span className="text-red-500">📍</span> Browse by{" "}
        <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
          Districts Location
        </span>
      </h2>

      {/* <div className="text-sm mb-4">
        {selectedCity ? (
          <p className="font-semibold text-red-600">Selected: {selectedCity}</p>
        ) : (
          <p className="text-gray-600">Click a marker on the map to select</p>
        )}
      </div>  */}

      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE - District List */}
        <div className="flex-1 w-full md:w-1/3  p-4 max-h-[400px] overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {visibleDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => {
                  setSelectedCity(district.name);
                  navigate(
                    `/dashboard?location=${encodeURIComponent(district.name)}`
                  );
                }}
                className={`text-sm px-2 text-left ${
                  selectedCity === district.name
                    ? "bg-red-500 text-white"
                    : "hover:bg-yellow-100 text-gray-800"
                }`}
              >
                {district.name} (0)
              </button>
            ))}
          </div>
          {!showAll && districtsData.districts.length > 30 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                See more
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Map */}
        <div className="flex-1 h-[400px]  rounded-lg overflow-hidden border border-gray-300 z-0">
          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7.3}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            minZoom={6}
            maxZoom={10}
            maxBounds={[
              [20.5, 87.5], // Southwest corner of Bangladesh
              [26.7, 92.7], // Northeast corner of Bangladesh
            ]}
            maxBoundsViscosity={1.0}
            dragging={true}
            zoomControl={true}
            doubleClickZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {districtsData.districts.map((district) => (
              <Marker
                key={district.id}
                position={[parseFloat(district.lat), parseFloat(district.long)]}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(district.name);
                    navigate(
                      `/dashboard?location=${encodeURIComponent(district.name)}`
                    );
                  },
                }}
              >
                <Popup>{district.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default CityRegionSelector;
