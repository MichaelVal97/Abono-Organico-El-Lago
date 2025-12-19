'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationPicker({ onLocationSelect, initialLat = 4.6097, initialLng = -74.0817 }: LocationPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        // Init map if not exists
        if (mapContainerRef.current && !mapRef.current) {

            const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add Free Shipping Zone (Fusagasugá)
            const fusaCoords: [number, number] = [4.33646, -74.36378];
            L.circle(fusaCoords, {
                color: 'green',
                fillColor: '#22c55e',
                fillOpacity: 0.1,
                radius: 10000 // 10km
            }).addTo(map);

            // Add tooltip for zone
            L.marker(fusaCoords, {
                icon: L.divIcon({
                    className: 'bg-transparent border-none',
                    html: '<div class="text-xs font-bold text-green-700 bg-white/80 px-2 py-1 rounded shadow-sm w-32 text-center -ml-16">Zona Envío Gratis (10km)</div>'
                })
            }).addTo(map);

            // Add initial marker
            const marker = L.marker([initialLat, initialLng], { icon: customIcon }).addTo(map);
            marker.bindPopup("Ubicación de entrega").openPopup();
            markerRef.current = marker;

            // Click handler
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;

                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
                }

                map.flyTo([lat, lng], map.getZoom());
                onLocationSelect(lat, lng);
            });
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures run once on mount

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-primary/20 relative z-0">
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-md shadow-lg z-[1000] text-sm text-center border pointer-events-none">
                <p className="font-medium text-foreground">
                    Toca en el mapa para seleccionar tu ubicación exacta de entrega
                </p>
            </div>
        </div>
    );
}
