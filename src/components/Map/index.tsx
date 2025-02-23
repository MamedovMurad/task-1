import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf'; // Import Turf.js
import { IMockData } from '../../Models/mock';

export interface IAppProps {
  data: IMockData[];
  selectedCordinateId: number | null;
  allList: IMockData[];
  insidePoints: { lng: number, lat: number }[];
  filterDataForMap: (params: { lng: number; lat: number; }[]) => void;
  setInsidePoints: (param: { lng: number, lat: number }[]) => void;
  setSelectedId: (param: number | null) => void, 
}

export function MapUI(props: IAppProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const [selectedArea, setSelectedArea] = useState<any>(null);
  // const [selectedMarker, setSelectedMarker] = useState<IMockData | null>(null); 
  // const [markerPosition, setMarkerPosition] = useState<{ top: number; left: number } | null>(null); 
  const locations = props.data?.map((item) => ({
    lng: item.longitude,
    lat: item.latitude,
  }));
  const allLocations = props.allList?.map((item) => ({
    lng: item.longitude,
    lat: item.latitude,
  }));

  useEffect(() => {
    if (!mapContainerRef.current || locations?.length < 1) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;;;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    mapRef.current = map;

    // Add markers for each location
    locations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({ color: 'red' }) // Red markers for all locations
        .setLngLat([location.lng, location.lat])
        .addTo(map);

      // Add click event to each marker
      marker.getElement().addEventListener('click', () => {
        // Set the selected marker data
        const selectedData = props.data[index];
        // setSelectedMarker(selectedData);
        props.setSelectedId(selectedData.id);

        // Get the marker's pixel position on the map
        // const markerElement = marker.getElement();
        // const markerPositionInPixels = map.project([location.lng, location.lat]);

        // Set the info box position relative to the marker
        // setMarkerPosition({
        //   top: (markerPositionInPixels.y + markerElement.offsetHeight + 10)+116, // Position below the marker
        //   left: (markerPositionInPixels.x - markerElement.offsetWidth / 2)+50, // Center it horizontally on the marker
        // });

        // Optional: Zoom into the marker when clicked
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 7,
          essential: true,
        });
      });
    });

    // Initialize and add Mapbox Draw control
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw);
    drawRef.current = draw;

    // Handle polygon selection
    if (props.selectedCordinateId) {
      const specData = props.data.find((item) => item.id === props.selectedCordinateId) || { longitude: 0, latitude: 0 };
      map.flyTo({
        center: [specData?.longitude, specData?.latitude],
        zoom: 7,
        essential: true,
      });
    }
    
    map.on('draw.create', (e: any) => {
      const selectedGeoJSON = e.features[0].geometry;

      if (selectedGeoJSON.type === 'Polygon') {
        const polygon = turf.polygon([selectedGeoJSON.coordinates[0]]);
        setSelectedArea(selectedGeoJSON.coordinates[0]);

        // Check which points are inside the selected polygon
        const inside = allLocations.filter((location) => {
          const point = turf.point([location.lng, location.lat]);
          return turf.booleanPointInPolygon(point, polygon);
        });

        props.filterDataForMap(inside);
        props.setInsidePoints(inside);
      }
    });

    return () => {
      map.remove();
    };
  }, [props.data, props.selectedCordinateId]);

  return (
    <>
      {locations.length > 0 && <div id="map-container" ref={mapContainerRef} className="w-full h-full" />}

      {/* {selectedMarker && markerPosition && (
        <div
          style={{
            position: 'absolute',
            top: `${markerPosition.top}px`,
            left: `${markerPosition.left}px`,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxWidth: '250px',
          }}
        >
          <strong>Selected Marker Info:</strong>
          <ul>
            <li>ID: {selectedMarker.id}</li>
            <li>Name: {selectedMarker.first_name} {selectedMarker.last_name}</li>
            <li>Phone: {selectedMarker.phone_number}</li>
            <li>Location: {selectedMarker.latitude}, {selectedMarker.longitude}</li>
            <li>Date: {selectedMarker.datetime}</li>
          </ul>
        </div>
      )} */}

      {selectedArea && (
        <div
          style={{
            position: 'absolute',
            bottom: 110,
            left: 20,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {/* <strong>Points Inside Selected Area:</strong>
          {props.insidePoints.length > 0 ? (
            <ul>
              {props.insidePoints.map((p, index) => (
                <li key={index}>✅ [{p.lng}, {p.lat}]</li>
              ))}
            </ul>
          ) : (
            '❌ No points inside'
          )} */}
        </div>
      )}
    </>
  );
}
