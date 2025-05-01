import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ATM } from '@/types/atm';
import { Button } from '@/components/ui/button';
import { formatDistance } from '@/services/atmService';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Set default icon (defined once outside component)
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create green user icon (defined once outside component)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Memoized UserLocationMarker to prevent unnecessary re-renders
const UserLocationMarker = React.memo(({ userLocation }: { userLocation: [number, number] }) => (
  <Marker
    position={userLocation}
    icon={userIcon}
    key="user-location"
  >
    <Popup>Your current location</Popup>
  </Marker>
));

interface MapControllerProps {
  userLocation: [number, number] | null;
  selectedATM: ATM | null;
  showRoute: boolean;
  setShowRoute: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapController: React.FC<MapControllerProps> = ({
  userLocation,
  selectedATM,
  showRoute,
  setShowRoute
}) => {
  const map = useMap();
  const routingControlRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!selectedATM) return;

    if (showRoute && userLocation && selectedATM && map) {
      try {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }

        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(selectedATM.location.lat, selectedATM.location.lon)
          ],
          lineOptions: {
            styles: [{ color: "#3A86FF", weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0
          },
          show: false,
          addWaypoints: false,
          routeWhileDragging: false,
          fitSelectedRoutes: true,
          showAlternatives: false,
          createMarker: function() {
            return null;
          }
        }).addTo(map);

        routingControlRef.current = routingControl;
      } catch (error) {
        console.error("Error creating route:", error);
        setShowRoute(false);
      }
    } else if (!showRoute && routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [showRoute, userLocation, selectedATM, map, setShowRoute]);

  return null;
};

const useInitialCenter = (center: [number, number] | null) => {
  const map = useMap();
  const hasCenteredRef = React.useRef(false);

  React.useEffect(() => {
    if (center && !hasCenteredRef.current) {
      map.flyTo(center, 15);
      hasCenteredRef.current = true;
    }
  }, [center, map]);
};

const InitialCenter: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  useInitialCenter(center);
  return null;
};

interface ATMMapProps {
  atms: ATM[];
  userLocation: [number, number] | null;
  nearestATM: ATM | null;
  selectedATM: ATM | null;
  setSelectedATM: (atm: ATM | null) => void;
  showRoute: boolean;
  setShowRoute: (show: boolean) => void;
}

const ATMMap: React.FC<ATMMapProps> = ({
  atms,
  userLocation,
  nearestATM,
  selectedATM,
  setSelectedATM,
  showRoute,
  setShowRoute
}) => {
  const calculateDistanceFromUser = (atm: ATM) => {
    if (!userLocation) return null;

    const R = 6371e3;
    const φ1 = (userLocation[0] * Math.PI) / 180;
    const φ2 = (atm.location.lat * Math.PI) / 180;
    const Δφ = ((atm.location.lat - userLocation[0]) * Math.PI) / 180;
    const Δλ = ((atm.location.lon - userLocation[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const safeAtms = Array.isArray(atms) ? atms : [];

  if (safeAtms.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading ATM data...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={userLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <InitialCenter center={userLocation} />

        {userLocation && <UserLocationMarker userLocation={userLocation} />}

        {safeAtms.map(atm => (
          <Marker
            key={atm.id}
            position={[atm.location.lat, atm.location.lon]}
            eventHandlers={{
              click: () => setSelectedATM(atm),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-medium text-lg">{atm.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{atm.operator}</p>
                {userLocation && (
                  <p className="text-sm font-medium">
                    Distance: {formatDistance(calculateDistanceFromUser(atm) || 0)}
                  </p>
                )}
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="bg-atm-accent text-white hover:bg-atm-accent/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedATM(atm);
                      setShowRoute(true);
                    }}
                    disabled={!userLocation}
                  >
                    Show Route
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController
          userLocation={userLocation}
          selectedATM={selectedATM}
          showRoute={showRoute}
          setShowRoute={setShowRoute}
        />
      </MapContainer>

      {showRoute && (
        <Button
          variant="outline"
          className="absolute top-4 right-4 z-[1000] bg-white"
          onClick={() => setShowRoute(false)}
        >
          Clear Route
        </Button>
      )}
    </div>
  );
};

export default ATMMap;