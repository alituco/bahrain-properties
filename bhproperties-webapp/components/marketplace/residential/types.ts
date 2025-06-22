/* components/marketplace/residential/types.ts
   ─────────────────────────────────────────── */

/* ---------- option sets (apartments-only legacy) ------------- */
export type AptOptions = {
  bedrooms : string[];
  bathrooms: string[];
  areas    : string[];
};

/* ---------- NEW  – unified option set ------------------------ */
export type ResidentialOptions = AptOptions & {
  /** which property types are included in this response */
  types: ('apartment' | 'house')[];
};

/* ---------- data models -------------------------------------- */
/* Apartment (from firm_properties + unit_properties join) */
export interface Apartment {
  id           : number;
  title        : string | null;
  listing_type : 'sale' | 'rent';
  asking_price : number | null;
  rent_price   : number | null;
  bedrooms     : number;
  bathrooms    : number;
  area_name    : string | null;
  images       : string[];

  /* optional extras (list-view may omit) */
  size_m2?      : number | null;
  block_no?     : string | null;
  latitude?     : number | null;
  longitude?    : number | null;
  status?       : string;
  description?  : string;
  realtor_name?: string | null;
  phone_number?: string | null;
  email?       : string | null;
}

/* House (from firm_properties + house_properties join) */
export interface House {
  id            : number;
  title         : string | null;
  listing_type  : 'sale' | 'rent';
  asking_price  : number | null;
  rent_price    : number | null;
  bedrooms      : number;
  bathrooms     : number;
  area_name     : string | null;
  images        : string[];

  plot_size_m2? : number | null;
  built_up_m2?  : number | null;
  floors?       : number | null;
  parking_spots?: number | null;
  latitude?     : number | null;
  longitude?    : number | null;
  status?       : string;
  description?  : string;
}

/* Discriminated union used everywhere in the UI */
export type Listing =
  | (Apartment & { property_type: 'apartment' })
  | (House     & { property_type: 'house'     });
