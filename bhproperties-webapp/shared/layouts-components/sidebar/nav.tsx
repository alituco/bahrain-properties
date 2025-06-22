const Dashboardicon = <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 side-menu__icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path></svg>
const Erroricon = <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 side-menu__icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path> </svg>

const NestedmenuIcon = <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 side-menu__icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"></path> </svg>
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from '@mui/icons-material/Apartment';

const MembersIcon = (
  <PeopleIcon className="w-6 h-6 side-menu__icon" />
);

const PropertyIcon = (
  <ApartmentIcon className="w-6 h-6 side-menu__icon" />
)


export const MENUITEMS: any = [

  {
    menutitle: "MAIN",
  },

  {
    title: "Dashboards", icon: Dashboardicon, type: "sub", active: false, children: [
      { path: "/dashboard", type: "link", active: false, selected: false, title: "Home" },
    ]
  },
  {
    title: "Land Plots", icon: PropertyIcon, type: "sub", active: false, children: [
      { path: "/dashboard/saved-properties", type: "link", active: false, selected: false, title: "Land Plots" },
      { path: "/dashboard/map", type: "link", active: false, selected: false, title: "Land Mappings" },
      { path: "/dashboard/active-land-listings", type: "link", active: false, selected: false, title: "Active Listings" },
    ]
  },
  {
    title: "Apartments", icon: PropertyIcon, type: "sub", active: false, children: [
      { path: "/dashboard/apartment/apartment-properties", type: "link", active: false, selected: false, title: "Apartment Properties" },
      { path: "/dashboard/apartment/add-apartment-property", type: "link", active: false, selected: false, title: "Add an Apartment Property" },
      { path: "/dashboard/active-apartment-listings", type: "link", active: false, selected: false, title: "Active Listings" },
    ]
  },

  {
    title: "House", icon: PropertyIcon, type: "sub", active: false, children: [
      { path: "/dashboard/house/properties", type: "link", active: false, selected: false, title: "House Properties" },
      { path: "/dashboard/house/add-house-property", type: "link", active: false, selected: false, title: "Add an House Property" },
      { path: "/dashboard/active-house-listings", type: "link", active: false, selected: false, title: "Active Listings" },
    ]
  },
  {
    title: "Realtors", icon: MembersIcon, type: "sub", active: false, children: [
      { path: "/dashboard/realtors", type: "link", active: false, selected: false, title: "View Realtors" },
    ]
  },

]