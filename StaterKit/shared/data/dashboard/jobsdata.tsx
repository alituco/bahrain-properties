import Link from "next/link"

//jobs-statistics
export const Jobsseries = [
  {
    name: "Applications",
    data: [30, 25, 36, 30, 45, 35, 64],
  },
  {
    name: "Shortlisted",
    data: [33, 21, 32, 37, 23, 32, 47],
  },
  {
    name: "Rejected",
    data: [30, 25, 36, 30, 45, 35, 64],
  },
  {
    name: "On-Hold",
    data: [44, 55, 41, 42, 22, 43, 21],
  },
]
export const Jobsoptions: any = {
  chart: {
    type: "bar",
    height: 325,
    fontFamily: "Montserrat, sans-serif",
    foreColor: "#d4d7d9",
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "top",
    markers: {
      shape: "circle",
      height: 6,
      size: 6,
      width: 6,
      strokeWidth: 0
    }
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    shared: true,
    intersect: false,
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 0.5)", "rgba(255, 93, 159, .4)", "rgba(255, 142, 111, .3)"],
  labels: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ],
  plotOptions: {
    bar: {
      columnWidth: "25%",
      borderRadius: 5,
    },
  },
  xaxis: {
    // show: false,

    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false
    }
  }
}

//job-acceptance
export const Acceptseries = [1754, 634]
export const Acceptoptions: any = {
  chart: {
    height: 200,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },

  legend: {
    show: false,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    // colors: "#fff",
    width: 1,
    dashArray: 0,
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      expandOnClick: false,
      donut: {
        size: '70%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '20px',
            color: '#495057',
            offsetY: -25
          },
          value: {
            show: true,
            fontSize: '12px',
            color: undefined,
            offsetY: -25,
            formatter: function (val: string) {
              return val + "%"
            }
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '14px',
            fontWeight: 600,
            color: '#495057',
          }
        }
      }
    }
  },
  grid: {
    padding: {
      bottom: -100
    }
  },
  colors: ["var(--primary-color)", "rgb(227, 84, 212)"],
}

const svg1 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,80l-96,56L32,80l96-56Z" opacity="0.2"></path><path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path></svg>
const svg2 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"></path></svg>
const svg3 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M120,104A40,40,0,1,1,80,64,40,40,0,0,1,120,104Z" opacity="0.2"></path><path d="M152,80a8,8,0,0,1,8-8h88a8,8,0,0,1,0,16H160A8,8,0,0,1,152,80Zm96,40H160a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Zm0,48H184a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm-96.25,22a8,8,0,0,1-5.76,9.74,7.55,7.55,0,0,1-2,.26,8,8,0,0,1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09,18.05-56.25,42a8,8,0,0,1-15.5-4c5.59-21.71,21.84-39.29,42.46-48a48,48,0,1,1,58.58,0C129.91,150.71,146.16,168.29,151.75,190ZM80,136a32,32,0,1,0-32-32A32,32,0,0,0,80,136Z"></path></svg>
const svg4 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
const svg5 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M159.46,53l-17.78,83H114.32L96.54,53A24,24,0,0,1,120,24h16A24,24,0,0,1,159.46,53Z" opacity="0.2"></path><path d="M224,224a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,224Zm0-80v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V144a16,16,0,0,1,16-16h56.43L88.72,54.71A32,32,0,0,1,120,16h16a32,32,0,0,1,31.29,38.71L151.57,128H208A16,16,0,0,1,224,144ZM120.79,128h14.42l16.43-76.65A16,16,0,0,0,136,32H120a16,16,0,0,0-15.65,19.35ZM208,184V144H48v40H208Z"></path></svg>
export const Jobscard = [
  { id: 1, title: "JOB APPLICATIONS", count: "47,784", inc: "Increased By", percentageChange: "1.6%", icon: " ti ti-arrow-narrow-up", svgIcon: svg1, backgroundColor: "primary-transparent", color: "success", badgeColor: "primary" },
  { id: 2, title: "INTERVIEW SCHEDULE", count: "5,358", inc: "Decreased By", percentageChange: "3.1%", icon: " ti ti-arrow-narrow-down", svgIcon: svg2, backgroundColor: "primary1-transparent", color: "danger", badgeColor: "primary1" },
  { id: 3, title: "SHORTLISTED", count: "784", inc: "Increased By", percentageChange: "1.3%", icon: " ti ti-arrow-narrow-up", svgIcon: svg3, backgroundColor: "primary2-transparent", color: "success", badgeColor: "primary2" },
  { id: 4, title: "REJECTED APPLICATIONS", count: "47,784", inc: "Decreased By", percentageChange: "0.3%", icon: " ti ti-arrow-narrow-down", svgIcon: svg4, backgroundColor: "primary3-transparent", color: "danger", badgeColor: "primary3" },
  { id: 5, title: "ON-HOLD APPLICATIONS", count: "11,574", inc: "Increased By", percentageChange: "0.1%", icon: " ti ti-arrow-narrow-up", svgIcon: svg5, backgroundColor: "secondary-transparent", color: "success", badgeColor: "secondary" },
]

interface Recent {
  id: number;
  candidate: string;
  src: string;
  category: string;
  designation: string;
  mail: string;
  location: string;
  date: string;
  type: string;
  color: string;
  color1: string;
}
export const Recentdata: Recent[] = [
  { id: 1, candidate: "Mayor Kelly", src: "../../../assets/images/faces/4.jpg", category: "Manufacture", designation: "Team Lead", mail: "mayorkelly@gmail.com", location: "Germany", date: "Sep 15 - Oct 12, 2023", type: "Full Time", color: "primary", color1: "primary" },
  { id: 2, candidate: "Andrew Garfield", src: "../../../assets/images/faces/15.jpg", category: "Development", designation: "Sr.UI Developer", mail: "andrewgarfield@gmail.com", location: "Canada", date: "Apr 10 - Dec 12, 2023", type: "Full Time", color: "primary", color1: "secondary" },
  { id: 3, candidate: "Simon Cowel", src: "../../../assets/images/faces/11.jpg", category: "Service", designation: "Sr.UI Developer", mail: "simoncowel234@gmail.com", location: "Europe", date: "Sep 15 - Oct 12, 2023", type: "Part Time", color: "secondary", color1: "secondary" },
  { id: 4, candidate: "Mirinda Hers", src: "../../../assets/images/faces/8.jpg", category: "Marketing", designation: "Sales Executive", mail: "mirindahers@gmail.com", location: "USA", date: "Apr 10 - Dec 12, 2023", type: "Hybride", color: "danger", color1: "danger" },
  { id: 5, candidate: "Andrew Garfield", src: "../../../assets/images/faces/16.jpg", category: "Development", designation: "Sr.UI Developer", mail: "andrewgarfield@gmail.com", location: "London", date: "Jun 10 - Dec 12, 2022", type: "Freelancer", color: "success", color1: "secondary" },
]

const ename = <Link className="fw-medium text-primary" href="#!">John Doe</Link>
const ename1 = <span className="fw-medium text-primary1">#245</span>
const ename2 = <a className="fw-medium text-primary2 text-decoration-underline" href="#!">notification list</a>
const ename3 = <span className="fw-medium text-primary">#454</span>
export const Activedata = [
  { Id: 1, Icon: " ri-user-fill", Iconclass: "bg-primary-transparent avatar-sm", Title: "New Job Posted", Desc: "<p class='text-muted mb-0 fs-12 w-80 text-break'>Frontend Developer</p>", Duration: "2 mins ago", data2: "", DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 2, Icon: " ri-file-list-3-fill", Iconclass: "bg-primary1-transparent avatar-sm", Title: "New Application", Desc: "<p class='text-muted mb-0 fs-12 w-80 text-break'><a href='#!' class='fw-medium text-primary'>John Doe</a> applied for Frontend Develop..</p>", Duration: "5 mins ago", data2: ename, DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 3, Icon: " ri-user-fill", Iconclass: "bg-primary2-transparent avatar-sm", Title: "New Job Posted", Desc: "<p class='text-muted mb-0 fs-12 w-80 text-break'><span class='fw-medium text-primary1'>#245</span> Backend Developer </p>", Duration: "10 mins ago", data2: ename1, DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 4, Icon: " ri-user-fill", Iconclass: "bg-primary3-transparent avatar-sm", Title: "New Job Posted", Desc: "Backend Developer", Duration: "10 mins ago", data2: "", DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 5, Icon: " ri-calendar-check-fill", Iconclass: "bg-secondary-transparent avatar-sm", Title: "Updated Interview Dates", Desc: "Updated new interview scheduled and", Duration: "15 mins ago", data2: "", DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 6, Icon: " ri-calendar-check-fill", Iconclass: "bg-danger-transparent avatar-sm", Title: "Rescheduled Interview Dates", Desc: "<p class='text-muted mb-0 fs-12 w-80 text-break'>Rescheduled interview <a href='#!' class='fw-medium text-primary2 text-decoration-underline'>notification list</a></p>", Duration: "15 mins ago", data2: ename2, DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
  { Id: 7, Icon: " ri-time-fill", Iconclass: "bg-warning-transparent avatar-sm", Title: "Closed Job Post", Desc: "<p class='text-muted mb-0 fs-12 w-80 text-break'>closed React Job ID: <span class='fw-medium text-primary'>#454</span></p>", Duration: "15 mins ago", data2: ename3, DurationClass: 'text-muted ms-auto fs-12 flex-shrink-0' },
]

export const ReJobs = [
  { id: 1, icon: "android-line", title: "Sr. Mobile App Developer", color: "primary", post: "1 day ago", applicant: "56 ", location: "Georgia, XY", open: "27 May 2024" },
  { id: 2, icon: "database-2-line", title: "Data Scientist Trainee", color: "secondary", post: "1 day ago", applicant: "784", location: "Siberia, PQ", open: "03 Jun 2024" },
  { id: 3, icon: "reactjs-line", title: "React Developer", color: "info", post: "1 day ago", applicant: "421", location: "Italy, Rs", open: "18 Jun 2024" },
  { id: 4, icon: "amazon-line", title: "AWS Engineer", color: "success", post: "1 day ago", applicant: "257", location: "Georgia, XY", open: "15 Jun 2024" },
  { id: 5, icon: "layout-masonry-line", title: "Ui Developer", color: "warning", post: "2 days ago", applicant: "87", location: "Canada, UK", open: "20 Jun 2024" },
  { id: 6, icon: "angularjs-line", title: "Angular Developer", color: "danger", post: "3 days ago", applicant: "86", location: "Germany, US", open: "23 Jun 2024" },
]

export const Hiredata = [
  { id: 1, data: "UD", color: "primary", data1: "UI/UX Designers", data2: " 75% completed", color1: "success", candidate: "03", class: "mb-4" },
  { id: 2, data: "SD", color: "primary1", data1: "Senior Developer", data2: " 15% completed", color1: "danger", candidate: "12", class: "mb-4" },
  { id: 3, data: "MM", color: "primary2", data1: "Marketing Manager", data2: "pending", color1: "warning", candidate: "08", class: "mb-4" },
  { id: 4, data: "CW", color: "primary3", data1: "Content Writers", data2: "55% completed", color1: "success", candidate: "01", class: "mb-4" },
  { id: 5, data: "RD", color: "warning", data1: "React Developer", data2: "15% completed", color1: "danger", candidate: "03", class: "mb-1" },
]