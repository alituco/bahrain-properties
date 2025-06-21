"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled } from "@mui/material";
import { MapFilters } from "../MapContainer";
import FirmPropertyHover from "../FirmPropertyHover";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const Wrapper = styled(Box)({ width: "100%", position: "relative" });

interface Props extends MapFilters {
  flyTo?:   { lat: number; lon: number } | null;
  savedOnly?: boolean;
}

export default function MapComponent({
  status,
  block,
  area,
  governorate,
  minSize,
  maxSize,
  flyTo,
  savedOnly,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);

  const [loading,  setLoading]  = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x:number; y:number } | null>(null);
  const [hover,    setHover]    = useState<{ status?:string; parcel?:string } | null>(null);

  const qs = () => {
    const p = new URLSearchParams();
    if (status && status !== "all") p.append("status", status);
    if (block)       p.append("block_no",    block);
    if (area)        p.append("area_namee",  area);
    if (governorate) p.append("min_min_go",  governorate);
    if (minSize)     p.append("minSize",     minSize);
    if (maxSize)     p.append("maxSize",     maxSize);
    return p.toString();
  };

  const fetchGeo = async () => {
    const endpoint = savedOnly ? "firm-properties/geojson" : "coordinates";
    const { data } = await axios.get(`${API_URL}/${endpoint}?${qs()}`, { withCredentials:true });
    return {
      ...data,
      features: data.features.map((f:any,i:number)=>({ ...f, id:f.properties.parcel_no || i })),
    };
  };

  const refresh = async () => {
    setLoading(true);
    const geo = await fetchGeo();

    if (!mapRef.current && mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style:     "mapbox://styles/mapbox/streets-v11",
        center:    [50.55, 26.22],
        zoom:      10,
      });

      mapRef.current.on("load", () => {
        mapRef.current!.addSource("props", { type:"geojson", data:geo });

        mapRef.current!.addLayer({
          id:"poly",
          type:"fill",
          source:"props",
          paint:{
            "fill-color":[
              "case", ["==", ["get","firm_saved"], true], "#0099ff", "#9c27b0"
            ],
            "fill-opacity":0.45,
          },
        });

        mapRef.current!.addLayer({
          id:"outline",
          type:"line",
          source:"props",
          paint:{ "line-color":"#673ab7", "line-width":1 },
        });

        mapRef.current!.on("click", "poly", e=>{
          const parcel = e.features?.[0]?.properties?.parcel_no;
          if (parcel) window.open(`/dashboard/property/${parcel}`,"_self");
        });

        mapRef.current!.on("mousemove","poly",e=>{
          const f = e.features?.[0];
          const saved = f?.properties?.firm_saved;
          if (saved) {
            setHoverPos({ x:e.point.x, y:e.point.y });
            setHover({ status:f.properties?.status, parcel:f.properties?.parcel_no });
          } else {
            setHoverPos(null); setHover(null);
          }
          mapRef.current!.getCanvas().style.cursor="pointer";
        });

        mapRef.current!.on("mouseleave","poly",()=>{
          setHoverPos(null); setHover(null);
          mapRef.current!.getCanvas().style.cursor="";
        });

        setLoading(false);
      });
    } else if (mapRef.current) {
      (mapRef.current.getSource("props") as mapboxgl.GeoJSONSource)?.setData(geo);
      setLoading(false);
    }
  };

  useEffect(()=>{ refresh(); }, [status, block, area, governorate, minSize, maxSize, savedOnly]);

  useEffect(()=>{
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({ center:[flyTo.lon, flyTo.lat], zoom:17, essential:true });
    }
  }, [flyTo]);

  return (
    <Wrapper ref={mapContainer} sx={{ borderRadius:8, overflow:"hidden", paddingLeft: 2, paddingRight: 2} }>
      {loading && (
        <Box sx={{
          position:"absolute", inset:0, display:"flex",
          alignItems:"center", justifyContent:"center",
          backdropFilter:"blur(2px)", zIndex:5
        }}>
          <img src="/assets/images/media/loader.svg" width={48} height={48} alt="Loading…" />
        </Box>
      )}

      {hoverPos && hover && (
        <FirmPropertyHover
          x={hoverPos.x} y={hoverPos.y}
          savedByFirm status={hover.status} parcelNo={hover.parcel}
        />
      )}
    </Wrapper>
  );
}
