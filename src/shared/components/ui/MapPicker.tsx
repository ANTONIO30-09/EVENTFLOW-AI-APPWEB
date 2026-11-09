"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, MapPin } from "lucide-react";

// 1. NUEVO ICONO ROJO (El que pediste en la imagen)
const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const coordRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const defaultLat = initialLat || -17.3895;
  const defaultLng = initialLng || -66.1568;

  // 2. INICIALIZACIÓN DE LEAFLET
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Si el evento ya tenía coordenadas guardadas, mostrar el pin rojo
    if (initialLat && initialLng) {
      markerRef.current = L.marker([initialLat, initialLng], { icon: customIcon }).addTo(map);
    }

    // Evento al hacer clic en el mapa
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      
      // Actualizar o crear el pin rojo
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }

      // Obtener la dirección
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const address = data.display_name || `${lat}, ${lng}`;
        onLocationSelect(lat, lng, address);
      } catch {
        onLocationSelect(lat, lng, `${lat}, ${lng}`);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [defaultLat, defaultLng, initialLat, initialLng, onLocationSelect]);

  // 3. FUNCIÓN QUE MUEVE EL MAPA Y PONE EL PIN ROJO
  const moveMapTo = (lat: number, lng: number, address: string) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      
      // Poner o mover el pin rojo
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
      }
      
      onLocationSelect(lat, lng, address);
    }
  };

  // 4. BUSCADOR (Debounce)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      const timer = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(timer);
    }

    if (coordRegex.test(searchQuery.trim())) {
      const timer = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(timer);
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      let queryConContexto = searchQuery.trim();
      if (!queryConContexto.toLowerCase().includes("bolivia") && !queryConContexto.toLowerCase().includes("cochabamba")) {
        queryConContexto = `${queryConContexto}, Cochabamba, Bolivia`;
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryConContexto)}&countrycodes=bo&limit=5`);
        const data = await res.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSuggestion = (sug: Suggestion) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    moveMapTo(lat, lng, sug.display_name);
    setSearchQuery(sug.display_name);
    setSuggestions([]);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      const cleanInput = searchQuery.trim();
      
      if (coordRegex.test(cleanInput)) {
        const [lat, lng] = cleanInput.split(",").map(Number);
        moveMapTo(lat, lng, `Coordenadas: ${lat}, ${lng}`);
        setSuggestions([]);
        return;
      }

      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-[#0d131f]">
      
      <div className="w-full p-3 border-b border-white/10 z-20 shrink-0 bg-[#0d131f]/95 relative">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-brand-porcelain/50" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar dirección, hotel, lugar..."
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:border-brand-bronze transition-colors text-sm"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 text-brand-bronze animate-spin" size={18} />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-[#0d131f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[500]">
            {suggestions.map((sug) => (
              <button
                key={sug.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex items-start gap-3"
              >
                <MapPin size={16} className="text-brand-bronze mt-1 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white line-clamp-1">{sug.display_name.split(",")[0]}</span>
                  <span className="text-xs text-brand-porcelain/50 line-clamp-1">{sug.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="flex-1 w-full bg-[#0d131f] z-0" />
    </div>
  );
}
