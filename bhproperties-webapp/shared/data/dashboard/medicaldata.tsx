import Link from "next/link";

//statistics
export const Statseries = [
  {
    name: "Old Patients",
    data: [30, 35, 35, 30, 45, 25, 36, 54, 36, 29, 49, 42],
  },
  {
    name: "New Patients",
    data: [45, 30, 49, 30, 45, 25, 36, 54, 36, 29, 49, 42],
  },
]
export const Statoptions = {
  chart: {
    type: "bar",
    height: 361,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: false,
    },
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      borderRadiusApplication: "around",
      borderRadiusWhenStacked: "all",
      borderRadius: 3,
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    dashArray: 0,
  },
  grid: {
    borderColor: "#f5f4f4",
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 1)"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "top",
    markers: {
      size: 5,
      shape: "circle",
      strokeWidth: 0,
      strokeColor: "#fff",
      fillColors: undefined,
      radius: 5,
      customHTML: undefined,
      onClick: undefined,
      offsetX: 0,
      offsetY: 0,
    },
  },
  yaxis: {
    title: {
      style: {
        color: "#adb5be",
        fontSize: "14px",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        cssClass: "apexcharts-yaxis-label",
      },
    },
    axisBorder: {
      show: true,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: "solid",
      color: "rgba(119, 119, 142, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      formatter: function (y: number) {
        return y.toFixed(0) + "";
      },
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    axisBorder: {
      show: false,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
      borderType: "solid",
      color: "rgba(119, 119, 142, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      rotate: -90,
    },
  },
}

//Revenuestats
export const Statsseries = [230, 200, 178, 153]
export const Statsoptions = {
  chart: {
    width: 300,
    height: 308,
    type: 'polarArea',
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 1)", "rgba(255, 93, 159, 1)", "rgba(255, 142, 111, 1)"],
  labels: ["Revenue", "Income", "Profit", "Patients"],
  legend: {
    show: false,
  },
  stroke: {
    width: 0
  },
  fill: {
    opacity: 0.8
  },
}

//patients-chart
export const Patientseries = [1754, 1234]
export const Patientoptions = {
  labels: ["Male", "Female"],
  chart: {
    height: 260,
    type: "donut",
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 5,
      left: 0,
      blur: 3,
      color: "#525050",
      opacity: 0.1,
    },
  },
  dataLabels: {
    enabled: false,
  },

  legend: {
    show: false,
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "round",
    color: "#fff",
    width: 0,
    dashArray: 0,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: "80%",
        background: "transparent",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "20px",
            color: "#495057",
            offsetY: -4,
          },
          value: {
            show: true,
            fontSize: "18px",
            color: undefined,
            offsetY: 8,
            formatter: function (val: string) {
              return val + "%";
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: "Total",
            fontSize: "22px",
            fontWeight: 600,
            color: "#495057",
          },
        },
      },
    },
  },

  colors: ["var(--primary-color)", "rgb(227, 84, 212)"],
}

//staff-work
export const Staffseries = [
  {
    type: "area",
    name: "Day Shift",
    data: [15, 30, 22, 49, 32, 45, 30, 45, 65, 45, 25, 45],
  },
  {
    type: "line",
    name: "Night Shift",
    data: [8, 40, 15, 32, 45, 30, 20, 35, 28, 43, 30, 40],
  },
]
export const Staffoptions = {
  chart: {
    type: "line",
    height: 335,
    toolbar: {
      show: false,
    },
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 0.5)"],
  fill: {
    type: ["gradient", "solid"],
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
      colorStops: [
        [
          {
            offset: 0,
            color: "var(--primary01)",
            opacity: 50,
          },
          {
            offset: 75,
            color: "var(--primary01)",
            opacity: 0.5,
          },
          {
            offset: 100,
            color: "transparent",
            opacity: 0.5,
          },
        ],
        [
          {
            offset: 0,
            color: "rgba(158, 92, 247, 0.1)",
            opacity: 1,
          },
          {
            offset: 75,
            color: "rgba(158, 92, 247, 0.1)",
            opacity: 0.3,
          },
          {
            offset: 100,
            color: "transparent",
            opacity: 1,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "top",
    offsetX: 0,
    offsetY: 8,
  },
  stroke: {
    curve: "smooth",
    width: [2, 2],
    lineCap: "round",
  },
  grid: {
    borderColor: "#edeef1",
    strokeDashArray: 2,
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: "rgba(158, 92, 247, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: "solid",
      color: "rgba(158, 92, 247, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    axisBorder: {
      show: false,
      color: "rgba(158, 92, 247, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
      borderType: "solid",
      color: "rgba(158, 92, 247, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      rotate: -90,
    },
  }
}

export const Doctorlist = [
  { id: 1, src: "../../../assets/images/faces/doctors/1.jpg", dname: "Dr. Smith", designation: "Cardiology", qualification: "MBBS, Ph.D", exp: "4" },
  { id: 2, src: "../../../assets/images/faces/doctors/2.jpg", dname: "Dr. Johnson", designation: "Orthopedics", qualification: "MBBS, MD, DM", exp: "6" },
  { id: 3, src: "../../../assets/images/faces/doctors/3.jpg", dname: "Dr.L.Rickie Smtih", designation: "Orthopedics", qualification: "MBBS, MD, DM", exp: "6" },
  { id: 4, src: "../../../assets/images/faces/doctors/4.jpg", dname: "Dr.M.Angle", designation: "Gynecologist", qualification: "MBBS, MD, Ph.D", exp: "10" },
  { id: 5, src: "../../../assets/images/faces/doctors/5.jpg", dname: "Dr.S.Mary", designation: "Neurosurgeon", qualification: "MBBS, MD, Ph.D", exp: "3" },
  { id: 6, src: "../../../assets/images/faces/doctors/6.jpg", dname: "Dr.T.Laytoya Thoma", designation: "Dermatologists", qualification: "MBBS, MD, Ph.D", exp: "5" },
]

export const Patientslist = [
  { id: 1, patientid: "PAC-9ABC", pname: "Jhon Doe", gender: "Male", src: "../../../assets/images/faces/11.jpg", age: "25", doctor: "Dr.M.Smith", disease: "Hypertension", num: "123-456-7890", apt: "2023-10-20", roomno: "101", color: "primary" },
  { id: 2, patientid: "PAC-3SFW", pname: "Jane smith", gender: "Female", src: "../../../assets/images/faces/2.jpg", age: "35", doctor: "Dr. Johnson", disease: "Diabetes", num: "987-654-3210", apt: "2023-09-15", roomno: "102", color: "secondary" },
  { id: 3, patientid: "PAC-6SKF", pname: "Robert Jhonson", gender: "Male", src: "../../../assets/images/faces/12.jpg", age: "45", doctor: "Dr.M.Angle", disease: "Asthma", num: "456-789-0123", apt: "2023-11-05", roomno: "103", color: "success" },
  { id: 4, patientid: "PAC-3ESD", pname: "Emiley Davis", gender: "Female", src: "../../../assets/images/faces/5.jpg", age: "28", doctor: "Dr.S.Mary", disease: "Allergies", num: "789-012-3456", apt: "2023-08-12", roomno: "104", color: "orange" },
  { id: 5, patientid: "PAC-3KSE", pname: "William Martinez ", gender: "Male", src: "../../../assets/images/faces/11.jpg", age: "38", doctor: "Dr.S.Mary", disease: "General", num: "234-567-8901	", apt: "2023-12-08", roomno: "105", color: "info" },
  { id: 6, patientid: "PAC-4DFS", pname: "Sarah Wilson ", gender: "Female", src: "../../../assets/images/faces/4.jpg", age: "28", doctor: "Dr.T.Laytoya Thoma	", disease: "High Cholesterol", num: "567-890-1234", apt: "2023-07-25", roomno: "106", color: "warning" },
]

export const Marketcapcard = [
  {
    id: 1,
    value: "12,457",
    title: "Total Patients",
    percent: "-0.02%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="svg-icon-med position-absolute end-0 bottom-0 opacity-1 text-primary" fill="currentColor" viewBox="0 0 256 256">
        <path d="M136,108A52,52,0,1,1,84,56,52,52,0,0,1,136,108Z" opacity="0.2"></path>
        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
      </svg>
    ),
    changeType: "danger",
    icon1: 'down'
  },
  {
    id: 2,
    value: "2,987",
    title: "Total Doctors",
    percent: "-0.02%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="svg-icon-med position-absolute end-0 bottom-0 text-primary1 opacity-1" fill="currentColor" viewBox="0 0 256 256">
        <path d="M240,160a32,32,0,1,1-32-32A32,32,0,0,1,240,160Z" opacity="0.2"></path>
        <path d="M220,160a12,12,0,1,1-12-12A12,12,0,0,1,220,160Zm-4.55,39.29A48.08,48.08,0,0,1,168,240H144a48.05,48.05,0,0,1-48-48V151.49A64,64,0,0,1,40,88V40a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H56V88a48,48,0,0,0,48.64,48c26.11-.34,47.36-22.25,47.36-48.83V48H136a8,8,0,0,1,0-16h24a8,8,0,0,1,8,8V87.17c0,32.84-24.53,60.29-56,64.31V192a32,32,0,0,0,32,32h24a32.06,32.06,0,0,0,31.22-25,40,40,0,1,1,16.23.27ZM232,160a24,24,0,1,0-24,24A24,24,0,0,0,232,160Z"></path>
      </svg>
    ),
    changeType: "danger",
    icon1: 'down'
  },
  {
    id: 3,
    value: "35,324",
    title: "Total Appointments",
    percent: "+2.15%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="svg-icon-med position-absolute end-0 bottom-0 opacity-1 text-primary2" fill="currentColor" viewBox="0 0 256 256">
        <path d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path>
        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-48-56a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z"></path>
      </svg>
    ),
    changeType: "success",
    icon1: 'up'
  },
  {
    id: 4,
    value: "5,478",
    title: "Total Staff",
    percent: "+1.05%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="svg-icon-med position-absolute end-0 bottom-0 text-primary3 opacity-1" fill="currentColor" viewBox="0 0 256 256">
        <path d="M168,144a40,40,0,1,1-40-40A40,40,0,0,1,168,144ZM64,56A32,32,0,1,0,96,88,32,32,0,0,0,64,56Zm128,0a32,32,0,1,0,32,32A32,32,0,0,0,192,56Z" opacity="0.2"></path>
        <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1,0-16,24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.85,8,57,57,0,0,0-98.15,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
      </svg>
    ),
    changeType: "success",
    icon1: 'up'
  },
];


export const ScheduleData = [
  {
    id: 1,
    title: "Meeting with Doctors",
    subtitle: "video conference",
    startTime: "09:00",
    endTime: "12:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    id: 2,
    title: "Lunch with team members",
    subtitle: "Dolores Ait Labore Sit",
    startTime: "12:00",
    endTime: "13:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    id: 3,
    title: (
      <>
        Meeting With Doctors <Link href="#!" className="tx-primary">Yuhan Sev</Link>
      </>
    ),
    subtitle: "Golden Park",
    startTime: "16:00",
    endTime: "17:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    id: 4,
    title: "Appointment with Dr. Smith",
    subtitle: "Follow-up for annual physical examination",
    startTime: "18:15",
    endTime: "19:00",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData1 = [
  {
    title: "Assigning Medicines distribution To Patients",
    subtitle: "Task Basic",
    startTime: "09:35",
    endTime: "10:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: (
      <>
        Lunch With <Link href="#!" className="tx-primary">John Abu</Link>
      </>
    ),
    subtitle: "Silver Valley",
    startTime: "12:20",
    endTime: "13:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Checking Upcoming Projects & Schedules",
    subtitle: "Vlarhar Dhi Ionk Si",
    startTime: "15:40",
    endTime: "16:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Uploading New Projects In Terminal",
    subtitle: "WPN Project",
    startTime: "16:45",
    endTime: "17:00",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData2 = [
  {
    title: (
      <>
        Meeting With <Link href="#!" className="tx-primary">Abu Siddik</Link>
      </>
    ),
    subtitle: "Zoom Meeting",
    startTime: "10:00",
    endTime: "11:30",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Lunch with team members",
    subtitle: "Amet Dolor Clita",
    startTime: "13:45",
    endTime: "14:45",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Uploading New Dashboard",
    subtitle: "Iox Ui",
    startTime: "16:10",
    endTime: "16:30",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: (
      <>
        Meeting With Doctors <Link href="#!" className="tx-primary">Ion Habbu</Link>
      </>
    ),
    subtitle: "Backend",
    startTime: "16:55",
    endTime: "18:55",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData3 = [
  {
    title: "Developing Backend For Login Page",
    subtitle: "Backend",
    startTime: "10:00",
    endTime: "12:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: (
      <>
        Catch Lunch At <Link href="#!" className="tx-primary">Sed Lorem</Link>
      </>
    ),
    subtitle: "Lorem Ipsum",
    startTime: "13:15",
    endTime: "14:10",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Join Doctors Meeting",
    subtitle: "SpaceY",
    startTime: "15:30",
    endTime: "16:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Planning New Technology With Members",
    subtitle: "Rio",
    startTime: "17:30",
    endTime: "18:00",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData4 = [
  {
    title: (
      <>
        Meeting with <Link href="#!" className="tx-primary">Xion Shan</Link>
      </>
    ),
    subtitle: "G - Meets",
    startTime: "09:00",
    endTime: "11:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Updating UI Of Dashboard",
    subtitle: "Dashboard Xin",
    startTime: "12:50",
    endTime: "13:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Assigning Tasks To Members",
    subtitle: "Task MWU",
    startTime: "15:45",
    endTime: "16:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Dinner with team members",
    subtitle: "Amet Dolor Clita",
    startTime: "19:55",
    endTime: "20:30",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData5 = [
  {
    title: "Meeting with Doctors",
    subtitle: "video conference",
    startTime: "09:00",
    endTime: "12:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Lunch with team members",
    subtitle: "Dolores Ait Labore Sit",
    startTime: "12:00",
    endTime: "13:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: (
      <>
        Meeting With Doctors <Link href="#!" className="tx-primary">Yuhan Sev</Link>
      </>
    ),
    subtitle: "Golden Park",
    startTime: "16:00",
    endTime: "17:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Appointment with Dr. Smith",
    subtitle: "Follow-up for annual physical examination",
    startTime: "18:15",
    endTime: "19:00",
    iconClass: "ri-stethoscope-line",
  },
];

export const ScheduleData6 = [
  {
    title: "Assigning Tasks To Employees",
    subtitle: "Task Basic",
    startTime: "09:35",
    endTime: "10:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: (
      <>
        Lunch With <Link href="#!" className="tx-primary">John Abu</Link>
      </>
    ),
    subtitle: "Silver Valley",
    startTime: "12:20",
    endTime: "13:20",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Checking Upcoming Projects & Schedules",
    subtitle: "Vlarhar Dhi Ionk Si",
    startTime: "15:40",
    endTime: "16:00",
    iconClass: "ri-stethoscope-line",
  },
  {
    title: "Uploading New Projects In Terminal",
    subtitle: "WPN Project",
    startTime: "16:45",
    endTime: "17:00",
    iconClass: "ri-stethoscope-line",
  },
];
