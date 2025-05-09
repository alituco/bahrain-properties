"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import { Feature, Geometry, GeoJsonProperties } from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API = process.env.NEXT_PUBLIC_API_URL!;

interface ParcelGeo extends Feature<Geometry,GeoJsonProperties>{
  properties:{ parcel_no:string; longitude?:number; latitude?:number; }
}

interface Props { parcelNo:string; }

const PropertyMap:React.FC<Props>=({parcelNo})=>{
  const mapRef = useRef<mapboxgl.Map|null>(null);
  const cont   = useRef<HTMLDivElement>(null);
  const [geo,setGeo] = useState<ParcelGeo|null>(null);

  useEffect(()=>{
    (async()=>{
      const r=await fetch(`${API}/parcelData/geo/${parcelNo}`,{credentials:"include"});
      const d=await r.json(); setGeo(d);
    })();
  },[parcelNo]);

  useEffect(()=>{
    if(!geo) return;
    let center:[number,number]=[50.55,26.22];
    if(geo.properties.longitude&&geo.properties.latitude)
      center=[geo.properties.longitude,geo.properties.latitude];
    else if(geo.geometry.type==="Polygon"){
      const c=geo.geometry.coordinates as number[][][];
      if(c?.[0]?.[0]) center=[c[0][0][0],c[0][0][1]];
    }

    if(!mapRef.current){
      mapRef.current=new mapboxgl.Map({
        container:cont.current as HTMLElement,
        style:"mapbox://styles/mapbox/streets-v11",
        zoom:16, center
      });
      mapRef.current.on("load",()=>{
        mapRef.current!.addSource("parcel",{type:"geojson",data:geo});
        mapRef.current!.addLayer({
          id:"fill",type:"fill",source:"parcel",
          paint:{ "fill-color":"#0099ff","fill-opacity":0.4 }
        });
        mapRef.current!.addLayer({
          id:"outline",type:"line",source:"parcel",
          paint:{ "line-color":"#003366","line-width":2 }
        });
      });
    } else {
      const s=mapRef.current.getSource("parcel") as mapboxgl.GeoJSONSource;
      s?.setData(geo); mapRef.current.flyTo({center,zoom:16});
    }
  },[geo]);

  return <Box sx={{height:300,borderRadius:6,overflow:"hidden"}} ref={cont} />;
};

export default PropertyMap;
