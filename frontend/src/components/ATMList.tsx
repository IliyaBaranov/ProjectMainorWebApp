import React, { useState } from 'react';
import { ATM } from '@/types/atm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistance, calculateDistance } from '@/services/atmService';
import { MapPin, Route } from 'lucide-react';

interface ATMListProps {
  atms: ATM[];
  nearestATM: ATM | null;
  userLocation: [number, number] | null;
  selectedATM: ATM | null;
  setSelectedATM: (atm: ATM | null) => void;
  onShowRoute: (atm: ATM) => void;
}

const ATMList: React.FC<ATMListProps> = ({
  atms,
  nearestATM,
  userLocation,
  selectedATM,
  setSelectedATM,
  onShowRoute
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const safeAtms = Array.isArray(atms) ? atms : [];

  const filteredATMs = safeAtms.filter(atm =>
    atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atm.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedATMs = [...filteredATMs].sort((a, b) => {
    if (!userLocation) return 0;

    const distA = calculateDistance(
      userLocation[0], userLocation[1],
      a.location.lat, a.location.lon
    );
    const distB = calculateDistance(
      userLocation[0], userLocation[1],
      b.location.lat, b.location.lon
    );

    return distA - distB;
  });

  const handleRouteClick = (e: React.MouseEvent, atm: ATM) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedATM(atm);
    onShowRoute(atm);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Input
          placeholder="Search ATMs by name or operator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {nearestATM && userLocation && (
        <Card className="p-4 mb-4 border-l-4 border-l-atm-secondary bg-gradient-to-r from-atm-secondary/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1 flex flex-col">
              <span className="inline-block w-max text-xs font-bold uppercase text-atm-secondary px-2 py-0.5 rounded-full bg-atm-secondary/10 mb-1">
                Nearest
              </span>
              <div className="flex items-center">
                <h3 className="font-medium">{nearestATM.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{nearestATM.operator}</p>
              <div className="flex items-center gap-1 text-sm mt-1">
                <MapPin size={14} />
                <span>
                  {formatDistance(calculateDistance(
                    userLocation[0], userLocation[1],
                    nearestATM.location.lat, nearestATM.location.lon
                  ))}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-end h-full pt-6">
              <Button
                size="sm"
                type="button"
                className="bg-atm-secondary hover:bg-atm-secondary/80"
                onClick={(e) => handleRouteClick(e, nearestATM)}
              >
                <Route size={16} className="mr-1" />
                Show Route
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex-1 overflow-y-auto pr-2">
        {sortedATMs.length > 0 ? (
          <div className="grid gap-2">
            {sortedATMs.map((atm) => {
              const isNearest = nearestATM?.id === atm.id;
              if (isNearest) return null;

              return (
                <Card
                  key={atm.id}
                  className={`p-3 border-l-4 transition-colors ${
                    selectedATM?.id === atm.id
                      ? 'border-l-atm-accent bg-atm-accent/5'
                      : 'border-l-transparent hover:border-l-atm-accent/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{atm.name}</h3>
                      <p className="text-sm text-muted-foreground">{atm.operator}</p>
                      {userLocation && (
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <MapPin size={14} />
                          <span>
                            {formatDistance(calculateDistance(
                              userLocation[0], userLocation[1],
                              atm.location.lat, atm.location.lon
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      className="h-8"
                      onClick={(e) => handleRouteClick(e, atm)}
                    >
                      <Route size={16} className="mr-1" />
                      Show Route
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No ATMs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATMList;