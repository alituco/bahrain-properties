import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { GeoJSON } from 'geojson'; // Import GeoJSON types

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null); // Initialize as null

  // Fetch the GeoJSON from the backend
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get<GeoJSON.FeatureCollection<GeoJSON.Polygon>>('http://localhost:4000/coordinates');
        setGeojsonData(response.data); // Save the fetched GeoJSON data
        console.log('GeoJSON data: ', response.data)
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, []);

  // Initialize Mapbox and add polygons to the map
  useEffect(() => {
    if (!geojsonData) return; // Wait for data to load before attempting to render the map
    console.log(geojsonData)
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [50.55, 26.22], // Adjust to center the map in your region (Bahrain)
      zoom: 10,
    });

    map.on('load', () => {
      // Add GeoJSON data as a source
      map.addSource('property-polygons', {
        type: 'geojson',
        data: geojsonData, // Use the fetched GeoJSON data
      });

      // Add a layer to style the polygons
      map.addLayer({
        id: 'polygons-layer',
        type: 'fill',
        source: 'property-polygons',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.5,
        },
      });

      // Add a layer to outline the polygons
      map.addLayer({
        id: 'polygons-outline',
        type: 'line',
        source: 'property-polygons',
        paint: {
          'line-color': '#000000',
          'line-width': 2,
        },
      });

      map.addLayer({
        id: 'pacel-number-labels',
        type:'symbol',
        source: 'property-polygons',
        layout: {
            'text-field': ['get', 'parcel_no'],
            'text-size': 12,
            'text-anchor': 'center',
        },
        paint: {
            'text-color': '#000000'
        }
      })
    });

    return () => map.remove(); // Clean up the map on component unmount
  }, [geojsonData]); // Only trigger this effect when `geojsonData` is set

  return <div ref={mapContainerRef} style={{ width: '80vh', height: '80vh' }} />;
};

export default Map;
