import PeopleIcon from '@mui/icons-material/People';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import HouseSidingOutlinedIcon from '@mui/icons-material/HouseSidingOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const Dashboardicon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 side-menu__icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
  </svg>
);

const Erroricon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 side-menu__icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
  </svg>
);

const LandIcon = <LandscapeOutlinedIcon className="w-6 h-6 side-menu__icon" />;
const AptIcon  = <ApartmentOutlinedIcon className="w-6 h-6 side-menu__icon" />;
const HouseIcon = <HouseSidingOutlinedIcon className="w-6 h-6 side-menu__icon" />;
const InsightsIcon = <InsightsOutlinedIcon className="w-6 h-6 side-menu__icon" />;
const MembersIcon  = <PeopleIcon className="w-6 h-6 side-menu__icon" />;

export const MENUITEMS = [
  { menutitle: 'MAIN' },

  {
    title: 'Dashboards',
    icon: Dashboardicon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard', type: 'link', active: false, selected: false, title: 'Home' }
    ]
  },

  {
    title: 'Land Plots',
    icon: LandIcon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard/saved-properties', type: 'link', active: false, selected: false, title: 'Land Plots' },
      { path: '/dashboard/map', type: 'link', active: false, selected: false, title: 'Land Mappings' },
      { path: '/dashboard/add-a-property', type: 'link', active: false, selected: false, title: 'Add a Land' }
    ]
  },

  {
    title: 'Apartments',
    icon: AptIcon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard/apartment/apartment-properties', type: 'link', active: false, selected: false, title: 'Apartment Properties' },
      { path: '/dashboard/apartment/add-apartment-property', type: 'link', active: false, selected: false, title: 'Add an Apartment Property' }
    ]
  },

  {
    title: 'Houses',
    icon: HouseIcon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard/house/house-properties', type: 'link', active: false, selected: false, title: 'House Properties' },
      { path: '/dashboard/house/add-house-property', type: 'link', active: false, selected: false, title: 'Add a House Property' }
    ]
  },

  {
    title: 'Insights',
    icon: InsightsIcon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard/insights/firm', type: 'link', active: false, selected: false, title: 'Firm Insights' },
      { path: '/dashboard/insights/country', type: 'link', active: false, selected: false, title: 'Country Insights' }
    ]
  },

  {
    title: 'Realtors',
    icon: MembersIcon,
    type: 'sub',
    active: false,
    children: [
      { path: '/dashboard/realtors', type: 'link', active: false, selected: false, title: 'View Realtors' }
    ]
  }
];
