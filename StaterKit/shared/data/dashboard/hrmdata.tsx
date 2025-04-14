
//employees
export const Employseries = [
  {
    data: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 53, 53, 61, 27, 54, 43, 19, 46],
  },
]
export const Employoptions: any = ({ color }: any) => ({
  chart: {
    type: 'area',
    height: 50,
    sparkline: {
      enabled: true,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 0,
      left: 0,
      blur: 3,
      color: [color],
      opacity: 0.4,
    },
  },
  stroke: {
    curve: 'straight',
    width: [1],
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.5,
      opacityTo: 0.2,
      stops: [0, 60],
      colorStops: [
        [
          {
            offset: 0,
            color: 'var(--primary01)',
            opacity: 0.3
          },
          {
            offset: 60,
            color: 'var(--primary01)',
            opacity: 0.3
          }
        ],
      ]
    },
  },
  colors: [color],
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (seriesName: any) {
          return "";
        },
      },
    },
  },

})


//project-analysis
export const Analysisseries = [
  {
    type: "bar",
    name: "New Projects",
    data: [45, 30, 49, 45, 36, 42, 30, 35, 35, 54, 29, 36],
  },
  {
    type: "bar",
    name: "Inprogress Projects",
    data: [30, 35, 25, 20, 35, 25, 36, 54, 36, 29, 49, 42],
  },
  {
    type: "line",
    name: "Completed Projects",
    data: [15, 30, 19, 30, 34, 25, 36, 45, 36, 29, 49, 42],
  },
  {
    type: "area",
    name: "Onhold Projects",
    data: [15, 20, 20, 15, 25, 25, 15, 15, 45, 30, 45, 20],
  },
]
export const Analysisoptions = {
  chart: {
    type: "bar",
    height: 336,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "33%",
      borderRadiusApplication: "around",
      borderRadiusWhenStacked: "all",
      borderRadius: 3,
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    width: [5, 5, 2, 2],
    dashArray: [0, 0, 3, 3],
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
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 0.4)", "rgba(255, 93, 159, 0.2)", "rgba(255, 142, 111, 0.1)"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
    position: "bottom",
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
      // width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      rotate: -90,
    },
  },
}

//gender-chart
export const Genderseries = [500, 350, 150]
export const Genderoptions = {
  chart: {
    height: 288,
    type: 'polarArea'
  },
  labels: ['Total', 'Male', 'Female'],
  fill: {
    opacity: 0.9
  },
  stroke: {
    width: 1,
    colors: undefined
  },
  colors: ["var(--primary-color)", "rgb(227, 84, 212)", "rgb(255, 93, 159)"],
  yaxis: {
    show: false
  },
  legend: {
    position: 'bottom'
  },

}

export const Employeedata = [
  { id: 1, src: "../../../assets/images/faces/2.jpg", data: "Socrates Itumay", data1: "Team Lead", type: "Sick", days: "2 Days", status: "Approved", date: "30-05-2024", color: "success" },
  { id: 2, src: "../../../assets/images/faces/4.jpg", data: "Samantha Paul", data1: "Sr.UI Developer", type: "Casual	", days: "1 Days", status: "Pending", date: "29-05-2024", color: "warning" },
  { id: 3, src: "../../../assets/images/faces/14.jpg", data: "Gray Noal", data1: "Java Developer", type: "Paternity", days: "5 Days", status: "Approved", date: "28-05-2024", color: "success" },
  { id: 4, src: "../../../assets/images/faces/15.jpg", data: "Gray Noal", data1: "React Developer", type: "Paternity", days: "2 Days", status: "Rejected", date: "27-05-2024", color: "danger" },
  { id: 5, src: "../../../assets/images/faces/8.jpg", data: "Emiley Jackson", data1: "Full Stack Developer", type: "Maternity", days: "2 Days", status: "Approved", date: "26-05-2024", color: "success" },
  { id: 6, src: "../../../assets/images/faces/16.jpg", data: "Pope Johnson", data1: "Jr.Java Developer", type: "Gifted", days: "2 Days", status: "Pending", date: "25-05-2024", color: "warning" },
]

export const Interviewsdata = [
  { id: 1, src: "../../../assets/images/faces/15.jpg", data: "Anurag Batiya", data1: "03 May" },
  { id: 2, src: "../../../assets/images/faces/3.jpg", data: "Project Meeting", data1: "04 May" },
  { id: 3, src: "../../../assets/images/faces/6.jpg", data: "Team Meeting", data1: "05 May" },
  { id: 4, src: "../../../assets/images/faces/13.jpg", data: "Client Meeting", data1: "06 May" },
  { id: 5, src: "../../../assets/images/faces/3.jpg", data: "Client Meeting", data1: "06 May" },
  { id: 6, src: "../../../assets/images/faces/11.jpg", data: "Team Meeting", data1: "05 May" },
  { id: 7, src: "../../../assets/images/faces/1.jpg", data: "Project Meeting", data1: "04 May" },
]

export const Directorydata = [
  { id: 1, emplyid: "#emp23520", emplyname: "Richard Dom", position: "Team Leader", depart: "Backend", mail: "richard116@demo.com	", status: "Active", contacts: "+0987654321", salary: "$15,000", color: "success", src: "../../../assets/images/faces/1.jpg" },
  { id: 2, emplyid: "#emp23521", emplyname: "Kakashra Sri", position: "Web Developer", depart: "Front End", mail: "Kakashra987@demo.com", status: "Active", contacts: "+0986548761", salary: "$20,000", color: "success", src: "../../../assets/images/faces/2.jpg" },
  { id: 3, emplyid: "#emp23522", emplyname: "Nikki Jey", position: "Project Manager	", depart: "HR", mail: "Nikki654@demo.com", status: "On Leave", contacts: "0986548787", salary: "$25,000", color: "info", src: "../../../assets/images/faces/3.jpg" },
  { id: 4, emplyid: "#emp23523", emplyname: "Sasukey Ahuhi", position: "Project Manager", depart: "HR", mail: "Sasukey986@demo.com	", status: "Active", contacts: "+0986548788	", salary: "$30,000", color: "success", src: "../../../assets/images/faces/4.jpg" },
  { id: 5, emplyid: "#emp23524", emplyname: "Xiong Yu", position: "UI Developer", depart: "Engineering	", mail: "Xiongu987@demo.com", status: "Active", contacts: "+0986548988", salary: "$35,000", color: "success", src: "../../../assets/images/faces/5.jpg" },
  { id: 6, emplyid: "#emp23525", emplyname: "Arifa Zed", position: "Team Member", depart: "IT", mail: "Arifa432@demo.com", status: "Resigned", contacts: "+0986548985", salary: "$40,000", color: "danger", src: "../../../assets/images/faces/6.jpg" },
  { id: 7, emplyid: "#emp23526", emplyname: "Jennifer Tab", position: "Project Manager	", depart: "Front End", mail: "Jennifer543@demo.com", status: "Active", contacts: "+09865489987", salary: "$45,000", color: "success", src: "../../../assets/images/faces/7.jpg" },
]

export const Hrmcard = [
  {
    title: "Total Employees",
    value: "12,116",
    percentage: "2.5%",
    direction: "up",
    description: "Increased from last year",
    chartOptions: Employoptions({ color: "var(--primary-color)" }),
    chartSeries: Employseries,
    color: 'success'
  },
  {
    title: "Total Job Applied",
    value: "15,784",
    percentage: "1.5%",
    direction: "down",
    description: "Decreased from last year",
    chartOptions: Employoptions({ color: "rgb(227, 84, 212)" }),
    chartSeries: Employseries,
    color: 'danger'

  },
  {
    title: "Total Compensation",
    value: "$56,784",
    percentage: "6.0%",
    direction: "up",
    description: "Increased from last year",
    chartOptions: Employoptions({ color: "rgb(255, 93, 159)" }),
    chartSeries: Employseries,
    color: 'success'

  },
  {
    title: "Annual Compensation",
    value: "$6.8k",
    percentage: "6.0%",
    direction: "up",
    description: "Increased from last year",
    chartOptions: Employoptions({ color: "rgb(255, 142, 111)" }),
    chartSeries: Employseries,
    color: 'success'

  }
];


interface TimelineEvent {
  id: number;
  day: string;
  date: string;
  time: string;
  content: string;
  category: string;
  badge: string;
  badge1: string;
}

export const Eventsdata: TimelineEvent[] = [
  {
    id: 1,
    day: 'Mon',
    date: '02',
    time: '10:00AM',
    content: 'You have an announcement - Ipsum Est Diam Eirmod',
    category: 'Announcement',
    badge: 'bg-primary-transparent ms-2',
    badge1: 'primary'
  },
  {
    id: 2,
    day: 'Tue',
    date: '08',
    time: '',
    content: 'National holiday - Vero Jayanti',
    category: 'Holiday',
    badge: 'bg-warning-transparent',
    badge1: 'primary1'
  },
  {
    id: 3,
    day: 'Wed',
    date: '12',
    time: '09:00AM',
    content: 'John pup birthday - Team Member',
    category: 'Birthday',
    badge: 'bg-success-transparent ms-2',
    badge1: 'primary2'
  },
  {
    id: 4,
    day: 'Thu',
    date: '20',
    time: '',
    content: 'National Holiday - Dolore Ipsum',
    category: 'Holiday',
    badge: 'bg-warning-transparent',
    badge1: 'primary3'
  },
  {
    id: 5,
    day: 'Wed',
    date: '12',
    time: '04:00PM',
    content: 'Amet sed no dolor kasd - Et Dolores Tempor Erat',
    category: 'Announcement',
    badge: 'bg-primary-transparent ms-2',
    badge1: 'warning'
  },
  {
    id: 6,
    day: 'Fri',
    date: '21',
    time: '09:00AM',
    content: 'John pup birthday - Team Member',
    category: 'Birthday',
    badge: 'bg-success-transparent ms-2',
    badge1: 'secondary'
  },
];