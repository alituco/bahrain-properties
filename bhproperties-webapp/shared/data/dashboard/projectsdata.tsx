
//project-statistics
export const Staticseries = [
  {
    name: "Projects",
    type: "area",
    data: [15, 28, 23, 23, 41, 58, 48, 50, 22, 31, 40, 45],
  },
  {
    name: "Revenue",
    type: "bar",
    data: [20, 29, 37, 35, 44, 43, 50, 20, 20, 45, 45, 52],
  },
]
export const Staticoptions: any = {
  chart: {
    type: "area",
    height: 353,
    animations: {
      speed: 500,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 8,
      left: 0,
      blur: 4,
      // color: "#000",
      opacity: 0.08,
    },
  },
  colors: ["rgb(227, 84, 212)", "var(--primary-color)"],
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
  },
  fill: {
    type: ['gradient', 'solid'],
    gradient: {
      opacityFrom: 0.1,
      opacityTo: 0.2,
      shadeIntensity: 0.1,
    },
  },
  stroke: {
    curve: ["smooth", "smooth"],
    width: [2, 1.5],
    dashArray: [4, 5],
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: "bottom",
    inverseOrder: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "20%",
      borderRadius: 3,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
}
//monthly-target
export const Targetseries = [86, 80, 60]
export const Targetoptions: any = {
  chart: {
    height: 286,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
          offsetY: 0
        },
        value: {
          fontSize: '14px',
          offsetY: 5
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w: any) {
            return "249"
          }
        }
      }
    }
  },
  stroke: {
    lineCap: 'round'
  },
  grid: {
    padding: {
      bottom: -10,
      top: -10
    }
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 0.5)", "rgba(255, 93, 159, 0.4)"],
  labels: ['New Projects', 'Completed', 'Pending'],

}
//tasks-report
export const Tasksseries = [{
  name: 'This Week',
  data: [44, 42, 57, 86, 58, 55, 70],
}, {
  name: 'Last Week',
  data: [34, 22, 42, 56, 21, 86, 60],
}]
export const Tasksoptions: any = {
  chart: {
    type: 'line',
    height: 335,
    toolbar: {
      show: false,
    },
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 3
  },
  stroke: {
    width: 2,
    curve: 'smooth',
    dashArray: [0, 3],
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212)"],
  plotOptions: {
    bar: {
      borderRadius: 2,
      colors: {
        ranges: [{
          from: -100,
          to: -46,
          color: '#ebeff5'
        }, {
          from: -45,
          to: 0,
          color: '#ebeff5'
        }]
      },
      columnWidth: '50%',
      // dropShadow: {
      //     enabled: true,
      //     color: '#000',
      //     top: 1,
      //     left: 1,
      //     blur: 2,
      //     opacity: 0.5,
      // }
    }
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: 'top',
  },
  tooltip: {
    enabled: true,
    theme: "dark",
  },
  yaxis: {
    title: {
      style: {
        color: '#adb5be',
        fontSize: '14px',
        fontFamily: 'poppins, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-label',
      },
    },
    labels: {
      //formatter: function (y: number) {
      //  //return y.toFixed(0) + "";
      //}
    }
  },
  xaxis: {
    // type: 'day',
    categories: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
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
      // width: 6,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      rotate: -90
    }
  }
}

//Projects-2
const Proseries = [
  {
    name: "Data",
    data: [12, 14, 18, 47, 42, 15, 47, 75, 65, 19, 14, 50],
  },
]
const Projectoptions = ({ color }: any) => ({
  chart: {
    type: "bar",
    width: 70,
    height: 40,
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "80%",
      borderRadius: 2,
    },
  },
  stroke: {
    curve: "smooth",
    width: [2],
  },
  labels: ["1,2,3,4,5,6,7,8,9,10,11,12"],
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
    }
  }
})
export const Projectdata = [
  { id: 1, icon: "pages-line", color: "primary", projects: "New Projects", data: "432", badge: "-5.20%", color1: "danger", chartoptions: Projectoptions({ color: "rgb(227, 84, 212)" }), chartseries: Proseries, type: "bar" },
  { id: 2, icon: "check-double-line", color: "primary1", projects: "Completed", data: "122", badge: "+7.20%", color1: "success", chartoptions: Projectoptions({ color: "var(--primary-color" }), chartseries: Proseries, type: "bar" },
  { id: 3, icon: "loop-left-fill", color: "primary2", projects: "Ongoing Projects", data: "1,265", badge: "-5.20%", color1: "danger", chartoptions: Projectoptions({ color: "rgb(255, 93, 159)" }), chartseries: Proseries, type: "bar" },
  { id: 4, icon: "time-line", color: "primary3", projects: "Pending Projects", data: "1,265", badge: "+5.20%", color1: "success", chartoptions: Projectoptions({ color: "rgb(255, 142, 111)" }), chartseries: Proseries, type: "bar" },
]

export const Teamdata = [
  { id: 1, src: "../../../assets/images/faces/2.jpg", name: "Richard Dom", work: "457", status: "Online", task: "564/", task1: "1145", data: "Team Leader", color: "success" },
  { id: 2, src: "../../../assets/images/faces/11.jpg", name: "Jennifer Tab", work: "965", status: "Online", task: "1,754/", task1: "2145", data: "Project Manager", color: "success" },
  { id: 3, src: "../../../assets/images/faces/3.jpg", name: "Nikki Jey", work: "647", status: "Offline", task: "631/", task1: "1145", data: "UI Developer", color: "danger" },
  { id: 4, src: "../../../assets/images/faces/21.jpg", name: "Arifa Zed", work: "983", status: "Online", task: "502/", task1: "1236", data: "Web Developer", color: "success" },
  { id: 5, src: "../../../assets/images/faces/4.jpg", name: "Xiong Yu", work: "631", status: "Online", task: "360/", task1: "457", data: "Team Member", color: "success" },
  { id: 6, src: "../../../assets/images/faces/11.jpg", name: "Emanuel Gen", work: "478", status: "Offline", task: "558/", task1: "698", data: "Project Manager", color: "danger" },
]

export const Runningavatar = [
  { id: 1, src: "../../../assets/images/faces/11.jpg" },
  { id: 2, src: "../../../assets/images/faces/2.jpg" },
  { id: 3, src: "../../../assets/images/faces/5.jpg" },
  { id: 4, src: "../../../assets/images/faces/6.jpg" },
]

export const statusColors: any = {
  "In Progress": "bg-primary-transparent",
  "Pending": "bg-warning-transparent",
  "Completed": "bg-success-transparent"
};

export const projects = [
  {
    id: 1,
    title: "Home Page",
    progress: 35,
    total: 234,
    avatars: [
      "../../../assets/images/faces/8.jpg",
       "../../../assets/images/faces/4.jpg", 
       "../../../assets/images/faces/6.jpg", 
       "../../../assets/images/faces/7.jpg"
      ],
    status: "In Progress",
    date: "14-05-2024"
  },
  {
    id: 2,
    title: "Landing Design",
    progress: 80,
    total: 185,
    avatars: [
      "../../../assets/images/faces/8.jpg",
      "../../../assets/images/faces/4.jpg",
      "../../../assets/images/faces/6.jpg",
      "../../../assets/images/faces/7.jpg",
      "../../../assets/images/faces/8.jpg"
        ],
    status: "In Progress",
    date: "20-05-2024"
  },
  {
    id: 3,
    title: "New Template Design",
    progress: 10,
    total: 100,
    avatars: [
      "../../../assets/images/faces/8.jpg", 
      "../../../assets/images/faces/4.jpg", 
      "../../../assets/images/faces/16.jpg"
    ],
    status: "Pending",
    date: "29-05-2023"
  },
  {
    id: 4,
    title: "HR Management Design",
    progress: 63,
    total: 52,
    avatars: [
      "../../../assets/images/faces/8.jpg",
      "../../../assets/images/faces/14.jpg",
      "../../../assets/images/faces/4.jpg",
      "../../../assets/images/faces/16.jpg"
    ],
    extraAvatars: 2,
    status: "In Progress",
    date: "18-05-2024"
  },
  {
    id: 5,
    title: "Designing New Template",
    progress: 95,
    total: 192,
    avatars: [
      "../../../assets/images/faces/8.jpg",
      "../../../assets/images/faces/14.jpg",
      "../../../assets/images/faces/4.jpg",
      "../../../assets/images/faces/16.jpg"
    ],
    extraAvatars: 2,
    status: "Completed",
    date: "11-05-2024"
  },
  {
    id: 6,
    title: "Documentation Project",
    progress: 45,
    total: 72,
    avatars: [
      "../../../assets/images/faces/8.jpg",
      "../../../assets/images/faces/14.jpg",
      "../../../assets/images/faces/4.jpg",
      "../../../assets/images/faces/16.jpg",
      "../../../assets/images/faces/21.jpg"
    ],
    status: "In Progress",
    date: "18-05-2024"
  }
];

