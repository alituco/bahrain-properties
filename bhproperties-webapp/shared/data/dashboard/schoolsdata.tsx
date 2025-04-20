
//attendance

type State = {
  series: Array<any>;
  options: any;
};

export const Attseries = [
  {
    type: "area",
    name: "Staff",
    data: [
      {
        x: "Jan",
        y: 100,
      },
      {
        x: "Feb",
        y: 210,
      },
      {
        x: "Mar",
        y: 180,
      },
      {
        x: "Apr",
        y: 454,
      },
      {
        x: "May",
        y: 230,
      },
      {
        x: "Jun",
        y: 320,
      },
      {
        x: "Jul",
        y: 656,
      },
      {
        x: "Aug",
        y: 830,
      },
      {
        x: "Sep",
        y: 350,
      },
      {
        x: "Oct",
        y: 350,
      },
      {
        x: "Nov",
        y: 210,
      },
      {
        x: "Dec",
        y: 410,
      },
    ],
  },
  {
    type: "area",
    name: "Students",
    data: [
      {
        x: "Jan",
        y: 180,
      },
      {
        x: "Feb",
        y: 620,
      },
      {
        x: "Mar",
        y: 476,
      },
      {
        x: "Apr",
        y: 220,
      },
      {
        x: "May",
        y: 520,
      },
      {
        x: "Jun",
        y: 780,
      },
      {
        x: "Jul",
        y: 435,
      },
      {
        x: "Aug",
        y: 515,
      },
      {
        x: "Sep",
        y: 738,
      },
      {
        x: "Oct",
        y: 454,
      },
      {
        x: "Nov",
        y: 525,
      },
      {
        x: "Dec",
        y: 230,
      },
    ],
  },
  {
    type: "column",
    name: "Teachers",
    chart: {
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.1,
      },
    },
    data: [
      {
        x: "Jan",
        y: 210,
      },
      {
        x: "Feb",
        y: 380,
      },
      {
        x: "Mar",
        y: 400,
      },
      {
        x: "Apr",
        y: 250,
      },
      {
        x: "May",
        y: 300,
      },
      {
        x: "Jun",
        y: 420,
      },
      {
        x: "Jul",
        y: 380,
      },
      {
        x: "Aug",
        y: 280,
      },
      {
        x: "Sep",
        y: 380,
      },
      {
        x: "Oct",
        y: 350,
      },
      {
        x: "Nov",
        y: 230,
      },
      {
        x: "Dec",
        y: 250,
      },
    ],
  },
]
export const Attoptions: any = {
  chart: {
    height: 336,
    animations: {
      speed: 500,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["rgb(158, 92, 247)", "rgb(255, 93, 159)", "var(--primary-color)"],
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
  },
  fill: {
    type: ["gradient", "gradient", "solid"],
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      colorStops: [
        [
          {
            offset: 0,
            color: "rgb(158, 92, 247)",
            opacity: 0.05,
          },
          {
            offset: 100,
            color: "rgb(158, 92, 247)",
            opacity: 0.05,
          },
        ],
        [
          {
            offset: 0,
            color: "rgb(255, 93, 159)",
            opacity: 0.05,
          },
          {
            offset: 100,
            color: "rgb(255, 93, 159)",
            opacity: 0.05,
          },
        ],
      ],
    },
  },
  stroke: {
    curve: "smooth",
    width: [1, 1, 0],
    dashArray: [4, 0, 0, 0],
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: function (value: any) {
        return value;
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "15%",
      borderRadius: 2, // Changed to number for consistency
    },
  },
  legend: {
    show: false,
    position: "bottom",
    customLegendItems: ["Staff", "Students", "Teachers"],
    inverseOrder: true,
  },
  markers: {
    hover: {
      sizeOffset: 5,
    },
  },
};

//students-applicants
export const Stuseries = [{
  name: 'Projects',
  type: 'line',
  data: [26, 58, 44, 42, 57, 55, 45],
}, {
  name: 'Tasks',
  type: 'line',
  data: [56, 41, 55, 34, 54, 42, 57],
}]
export const Stuoptions = {
  chart: {
    height: 282,
    type: 'line',
    stacked: false,
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 7,
      left: 0,
      blur: 3,
      color: ["var(--primary-color)", "rgb(215, 124, 247)", "rgb(12, 215, 177)"],
      opacity: 0.1
    },
  },
  colors: ["var(--primary-color)", "rgb(215, 124, 247)", "rgb(12, 215, 177)"],
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 3
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 5,
    }
  },
  labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  markers: {
    size: 0,
  },
  legend: {
    show: true,
    position: 'top',
    fontFamily: "Montserrat",
    markers: {
      size: 5,
      shape: "circle",
      strokeWidth: 0
    }
  },
  xaxis: {
    type: 'week',
    axisBorder: {
      show: true,
      color: 'rgba(119, 119, 142, 0.05)',
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: 'solid',
      color: 'rgba(119, 119, 142, 0.05)',
      width: 6,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      rotate: -90
    }
  },
  yaxis: {
    title: {
      style: {
        color: '#adb5be',
        fontSize: '14px',
        fontFamily: 'Mulish, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-label',
      },
    },
  },
  // tooltip: {
  //     shared: true,
  //     theme: "dark",
  // }
}


export const Teacherdata = [
  { id: 1, src: "../../../assets/images/faces/11.jpg", name: "John Smith", qualification: "M.Ed", subject: "Mathematics", color: "primary" },
  { id: 2, src: "../../../assets/images/faces/3.jpg", name: "Mary Johnson", qualification: "B.A. in English", subject: "English", color: "secondary" },
  { id: 3, src: "../../../assets/images/faces/4.jpg", name: "Robert Davis", qualification: "Ph.D. in Science", subject: "Physics", color: "danger" },
  { id: 4, src: "../../../assets/images/faces/1.jpg", name: "Sarah Thompson", qualification: "M.A. in History", subject: "History", color: "info" },
  { id: 5, src: "../../../assets/images/faces/15.jpg", name: "Michael Brown", qualification: "B.Ed", subject: "Chemistry", color: "secondary" },
  { id: 6, src: "../../../assets/images/faces/2.jpg", name: "Emily Wilson", qualification: "M.A. in Geography", subject: "Geography", color: "pink" },
  { id: 7, src: "../../../assets/images/faces/5.jpg", name: "Sarah Smith", qualification: "M.A.", subject: "Hindi", color: "warning" },
]

export const Startdata = [
  { id: 1, iddata: "#1116", student: "Studar Little", class: "IX", marks: "75", marks1: "7.5", status: "Pass", color: "success", src: "../../../assets/images/faces/2.jpg", section: "B" },
  { id: 2, iddata: "#8547", student: "Ion Somer", class: "X", marks: "65", marks1: "6.5", status: "Pass", color: "success", src: "../../../assets/images/faces/4.jpg", section: "A" },
  { id: 3, iddata: "#7564", student: "Shakira", class: "X", marks: "25", marks1: "2.5", status: "Fail", color: "danger", src: "../../../assets/images/faces/6.jpg", section: "B" },
  { id: 4, iddata: "#1254", student: "Thomas Shelby", class: "IX", marks: "95", marks1: "9.5", status: "Pass", color: "success", src: "../../../assets/images/faces/8.jpg", section: "A" },
  { id: 5, iddata: "#7458", student: "Stefan U", class: "IX", marks: "62", marks1: "6.2", status: "Pass", color: "success", src: "../../../assets/images/faces/10.jpg", section: "B" },
  { id: 6, iddata: "#6325", student: "Michael Shreff", class: "X", marks: "15", marks1: "1.5", status: "Fail", color: "danger", src: "../../../assets/images/faces/12.jpg", section: "A" },
]

export const Examresult = [
  { id: 1, iddata: "#8547", student: "Ion Somer", src: "../../../assets/images/faces/4.jpg", sname: "Science", score: "92", color: "success" },
  { id: 2, iddata: "#7564 ", student: "Shakira", src: "../../../assets/images/faces/6.jpg", sname: "English", score: "78", color: "success" },
  { id: 3, iddata: "#1254", student: "Thomas Shelby", src: "../../../assets/images/faces/8.jpg", sname: "History", score: "88", color: "success" },
  { id: 4, iddata: "#7458", student: "Stefan U", src: "../../../assets/images/faces/10.jpg", sname: "Geography", score: "65", color: "secondary" },
  { id: 5, iddata: "#6325", student: "Michael Shreff", src: "../../../assets/images/faces/12.jpg", sname: "Physics", score: "80", color: "success" },
  { id: 6, iddata: "#2321", student: "Leo Phllip", src: "../../../assets/images/faces/4.jpg", sname: "Chemistry", score: "83", color: "success" },
]

interface CardData {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

// Example card data
export const SchoolCrad: CardData[] = [
  {
    title: 'Students',
    value: '62,784',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M7 12.27v3.72l5 2.73 5-2.73v-3.72L12 15zM5.18 9 12 12.72 18.82 9 12 5.28z" opacity=".2" />
        <path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm5 12.99-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72zm-5-3.27L5.18 9 12 5.28 18.82 9 12 12.72z" />
      </svg>
    ),
    colorClass: 'primary'
  },
  {
    title: 'Teachers',
    value: '3,765',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"></rect><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M8,15c-2.7,0-5.8,1.29-6,2.01V18h12v-1C13.8,16.29,10.7,15,8,15z" opacity=".2"></path><circle cx="8" cy="8" opacity=".2" r="2"></circle><polygon points="22,9 22,7 20,7 20,9 18,9 18,11 20,11 20,13 22,13 22,11 24,11 24,9"></polygon><path d="M8,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S4,5.79,4,8S5.79,12,8,12z M8,6c1.1,0,2,0.9,2,2s-0.9,2-2,2S6,9.1,6,8S6.9,6,8,6z"></path><path d="M8,13c-2.67,0-8,1.34-8,4v3h16v-3C16,14.34,10.67,13,8,13z M14,18H2v-0.99C2.2,16.29,5.3,15,8,15s5.8,1.29,6,2V18z"></path><path d="M12.51,4.05C13.43,5.11,14,6.49,14,8s-0.57,2.89-1.49,3.95C14.47,11.7,16,10.04,16,8S14.47,4.3,12.51,4.05z"></path><path d="M16.53,13.83C17.42,14.66,18,15.7,18,17v3h2v-3C20,15.55,18.41,14.49,16.53,13.83z"></path></g></g></svg>
    ),
    colorClass: 'primary1'
  },
  {
    title: 'Total Staff',
    value: '8,475',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24" y="0"></rect></g><g><g><path d="M14,13.5h4V12h-4V13.5z M14,16.5h4V15h-4V16.5z M20,7h-5V4c0-1.1-0.9-2-2-2h-2C9.9,2,9,2.9,9,4v3H4C2.9,7,2,7.9,2,9v11 c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V9C22,7.9,21.1,7,20,7z M11,4h2v5h-2V4z M20,20H4V9h5c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2h5V20 z M9,15c0.83,0,1.5-0.67,1.5-1.5c0-0.83-0.67-1.5-1.5-1.5s-1.5,0.67-1.5,1.5C7.5,14.33,8.17,15,9,15z M11.08,16.18 C10.44,15.9,9.74,15.75,9,15.75s-1.44,0.15-2.08,0.43C6.36,16.42,6,16.96,6,17.57V18h6v-0.43C12,16.96,11.64,16.42,11.08,16.18z"></path><path d="M13,11h-2c-1.1,0-2-0.9-2-2H4v11h16V9h-5C15,10.1,14.1,11,13,11z M9,12c0.83,0,1.5,0.67,1.5,1.5 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5C7.5,12.67,8.17,12,9,12z M12,18H6v-0.43c0-0.6,0.36-1.15,0.92-1.39 C7.56,15.9,8.26,15.75,9,15.75s1.44,0.15,2.08,0.43c0.55,0.24,0.92,0.78,0.92,1.39V18z M18,16.5h-4V15h4V16.5z M18,13.5h-4V12h4 V13.5z" opacity=".3"></path></g></g></svg>
    ),
    colorClass: 'primary2'
  },
  {
    title: 'Revenue',
    value: '$22,987',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M13 17c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6V5H5v14h14v-2h-6z" opacity=".2"></path><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.38-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"></path><circle cx="16" cy="12" r="1.5"></circle></svg>
    ),
    colorClass: 'primary3'
  },
  {
    title: 'Awards',
    value: '865',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><rect fill="none" height="24" width="24"></rect><path d="M12,14c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z" opacity=".2"></path><path d="M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M12,14 c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z M19,8c0,1.3-0.84,2.4-2,2.82V7h2V8z"></path></svg>
    ),
    colorClass: 'warning'
  }
];


interface Activity {
  id: number;
  name: string;
  time: string;
  action: string;
  additionalInfo?: string; // Optional for cases with extra details
  badge?: string; // Optional for badges
}

export const Schoolactivity = [
  {
    id: 1,
    activityUser: 'Mr. Thomas Brown',
    activityTime: '02:30PM',
    activityDesc: "Liked a post from <span class='badge bg-secondary-transparent'>Ms. Sarah Parker</span> about the upcoming school event"
  },
  {
    id: 2,
    activityUser: 'Mr. John Doe',
    activityTime: '12:47PM',
    activityDesc: 'Updated class schedule',
  },
  {
    id: 3,
    activityUser: 'Ms. Jane Smith',
    activityTime: '10:22AM',
    activityDesc: "Posted a <span class='text-primary3 fs-14 fw-medium'>new announcement</span>  <div class='p-2 rounded-1 bg-light fs-13'> Reminder: Parent-Teacher meeting on Friday at 3 PM 📅 </div>",
  },
  {
    id: 4,
    activityUser: 'Mrs. Emily Davis',
    activityTime: '11:30AM',
    activityDesc: "Commented on a student's project - <span class='fw-medium text-success'>'Excellent Work'</span>",
  },
  {
    id: 5,
    activityUser: 'Alice Johnson',
    activityTime: '11:45AM',
    activityDesc: "Submitted a report - <span class='fw-medium text-success fs-14'>'Science Project'</span>",
  },
  {
    id: 6,
    activityUser: 'Mr. Bob Anderson',
    activityTime: '10:54AM',
    activityDesc: "Reviewed a submission from <span class='badge bg-secondary-transparent'>Jane Smith</span>",
  }
];

interface EventData {
  title: string;
  description: string;
  date: string;
  iconClass: string;  // Class to apply for the icon
  badgeClass: string; // Class for badge styling
  badgeText: string;  // Text for the badge
  svgIcon: any;
}

export const EventData: EventData[] = [
  {
    title: 'Inter-School Sports Day',
    description: 'Students are gearing up for the annual inter-school.',
    date: '20 Mar 2024',
    iconClass: 'svg-primary',
    badgeClass: 'text-dark',
    badgeText: '20 Mar 2024',
    svgIcon: (
      <>
        <svg className="avatar-md avatar bg-primary-transparent svg-primary  p-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M232,112a24,24,0,0,0-24-24H136V79a32.06,32.06,0,0,0,24-31c0-28-26.44-45.91-27.56-46.66a8,8,0,0,0-8.88,0C122.44,2.09,96,20,96,48a32.06,32.06,0,0,0,24,31v9H48a24,24,0,0,0-24,24v23.33a40.84,40.84,0,0,0,8,24.24V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V159.57a40.84,40.84,0,0,0,8-24.24ZM112,48c0-13.57,10-24.46,16-29.79,6,5.33,16,16.22,16,29.79a16,16,0,0,1-32,0ZM40,112a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v23.33c0,13.25-10.46,24.31-23.32,24.66A24,24,0,0,1,168,136a8,8,0,0,0-16,0,24,24,0,0,1-48,0,8,8,0,0,0-16,0,24,24,0,0,1-24.68,24C50.46,159.64,40,148.58,40,135.33Zm160,96H56a8,8,0,0,1-8-8V172.56A38.77,38.77,0,0,0,62.88,176a39.69,39.69,0,0,0,29-11.31A40.36,40.36,0,0,0,96,160a40,40,0,0,0,64,0,40.36,40.36,0,0,0,4.13,4.67A39.67,39.67,0,0,0,192,176c.38,0,.76,0,1.14,0A38.77,38.77,0,0,0,208,172.56V200A8,8,0,0,1,200,208Z"></path></svg>
      </>
    )
  },
  {
    title: 'Science Exhibition <span class="text-primary2">"Science Fare"</span>',
    description: 'Explore innovative projects and experiments by our students.',
    date: '24 Mar 2024',
    iconClass: 'svg-primary1',
    badgeClass: 'text-dark',
    badgeText: '24 Mar 2024',
    svgIcon: (
      <>
        <svg className="avatar-md avatar bg-primary1-transparent svg-primary1  p-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path></svg>
      </>
    )
  },
  {
    title: 'Cultural Fest 2024',
    description: 'Join us for a vibrant celebration of cultural diversity',
    date: '09 Apr 2024',
    iconClass: 'svg-primary2',
    badgeClass: 'text-dark',
    badgeText: '09 Apr 2024',
    svgIcon: (
      <>
        <svg className="avatar-md avatar bg-primary2-transparent svg-primary2  p-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V216a8,8,0,0,0,11.58,7.16L64,208.94l28.42,14.22a8,8,0,0,0,7.16,0L128,208.94l28.42,14.22a8,8,0,0,0,7.16,0L192,208.94l28.42,14.22A8,8,0,0,0,232,216V56A16,16,0,0,0,216,40Zm0,163.06-20.42-10.22a8,8,0,0,0-7.16,0L160,207.06l-28.42-14.22a8,8,0,0,0-7.16,0L96,207.06,67.58,192.84a8,8,0,0,0-7.16,0L40,203.06V56H216ZM60.42,167.16a8,8,0,0,0,10.74-3.58L76.94,152h38.12l5.78,11.58a8,8,0,1,0,14.32-7.16l-32-64a8,8,0,0,0-14.32,0l-32,64A8,8,0,0,0,60.42,167.16ZM96,113.89,107.06,136H84.94ZM136,128a8,8,0,0,1,8-8h16V104a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H176v16a8,8,0,0,1-16,0V136H144A8,8,0,0,1,136,128Z"></path></svg>
      </>
    )
  },
  {
    title: 'Founders\' Day Celebration',
    description: 'Commemorating the vision and values of our school\'s founders.',
    date: '09 Apr 2024',
    iconClass: 'svg-primary3',
    badgeClass: 'text-dark',
    badgeText: '09 Apr 2024',
    svgIcon: (
      <>
        <svg className="avatar-md avatar bg-primary3-transparent svg-primary3  p-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path></svg>
      </>
    )
  },
  {
    title: 'Literary Week',
    description: 'Engage in a week full of literary activities.',
    date: '09 Apr 2024',
    iconClass: 'svg-secondary',
    badgeClass: 'text-dark',
    badgeText: '09 Apr 2024',
    svgIcon: (
      <>
        <svg className="avatar-md avatar bg-secondary-transparent svg-secondary  p-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg>
      </>
    )
  },
];