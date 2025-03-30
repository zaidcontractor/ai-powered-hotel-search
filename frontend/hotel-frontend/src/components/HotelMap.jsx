import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function HotelMap({ hotels }) {
  useEffect(() => {
    const map = L.map("hotel-map").setView([37.52402, -76.82526], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const hotelIcon = L.icon({
      iconUrl: "/dropped_pin.png", 
      iconSize: [30, 40], 
      iconAnchor: [15, 40], 
      popupAnchor: [0, -35]
    });

    const markerLayer = L.layerGroup().addTo(map);

    hotels.forEach((hotel) => {
      L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon })
        .addTo(markerLayer)
        .bindPopup(`<b>${hotel.name}</b>`);
    });

    return () => {
      map.remove();
    };
  }, [hotels]);

  return <div id="hotel-map" style={{ width: "90%", height: "400px", margin: "20px auto", borderRadius: "10px" }}></div>;
}

export default HotelMap;