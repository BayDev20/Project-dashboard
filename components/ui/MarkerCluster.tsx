import React, { useMemo } from 'react';
import { Marker } from 'react-simple-maps';
import { Warehouse } from '@/app/data/warehouseData';
import supercluster from 'supercluster';

interface MarkerClusterProps {
  points: Warehouse[];
  onClick: (data: Warehouse | { pointCount: number, address: string }, event: React.MouseEvent) => void;
  onMouseEnter: (data: Warehouse | { pointCount: number, address: string }) => void;
  onMouseLeave: () => void;
  showHeatMap: boolean;
  colorScale: (temp: number) => string;
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({ points, onClick, onMouseEnter, onMouseLeave, showHeatMap, colorScale }) => {
  const cluster = useMemo(() => {
    const index = new supercluster({
      radius: 40,
      maxZoom: 16,
    });
    index.load(points.map(point => ({
      type: 'Feature',
      properties: { cluster: false, warehouseId: point.name, warehouse: point },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude], // Use actual coordinates
      },
    })));
    return index;
  }, [points]);

  const clusters = useMemo(() => {
    return cluster.getClusters([-180, -85, 180, 85], Math.floor(3));
  }, [cluster]);

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates; // Use actual coordinates
        const { cluster: isCluster, point_count: pointCount, warehouseId } = cluster.properties;

        if (isCluster) {
          return (
            <Marker key={`cluster-${cluster.id}`} coordinates={[longitude, latitude]}>
              <circle
                r={10}
                fill="#F00"
                stroke="#fff"
                strokeWidth={2}
                onClick={(e: React.MouseEvent) => onClick({ pointCount, address: 'Cluster' }, e)}
                onMouseEnter={() => onMouseEnter({ pointCount, address: 'Cluster' })}
                onMouseLeave={onMouseLeave}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                y={4}
                style={{ fontFamily: 'system-ui', fill: '#fff', fontSize: 8 }}
              >
                {pointCount}
              </text>
            </Marker>
          );
        }

        if (!isCluster) {
          const warehouse = points.find(p => p.name === warehouseId);
          if (!warehouse) return null;

          return (
            <Marker key={`warehouse-${warehouseId}`} coordinates={[longitude, latitude]}>
              <circle
                r={4}
                fill={showHeatMap ? `rgba(255, ${255 - warehouse.temp * 2}, 0, 0.7)` : "#F00"}
                stroke="#fff"
                strokeWidth={2}
                onClick={(e: React.MouseEvent) => onClick(warehouse, e)}
                onMouseEnter={() => onMouseEnter(warehouse)}
                onMouseLeave={onMouseLeave}
                style={{ cursor: 'pointer' }}
              />
            </Marker>
          );
        }

        const warehouse = points.find(p => p.name === warehouseId);
        if (!warehouse) return null;

        return (
          <Marker key={`warehouse-${warehouseId}`} coordinates={[longitude, latitude]}>
            <circle
              r={4}
              fill="#F00"
              stroke="#fff"
              strokeWidth={2}
              onClick={(e: React.MouseEvent) => onClick(warehouse, e)}
              onMouseEnter={() => onMouseEnter(warehouse)}
              onMouseLeave={onMouseLeave}
              style={{ cursor: 'pointer' }}
            />
          </Marker>
        );
      })}
    </>
  );
};

export default MarkerCluster;
