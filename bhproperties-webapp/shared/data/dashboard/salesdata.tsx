
//Sales Overview
export const Overseries = [{
  name: 'Growth',
  type: "column",
  data: [140, 120, 190, 364, 140, 230, 166, 340, 260, 260, 120, 320]
}, {
  name: "Profit",
  type: "area",
  data: [180, 620, 476, 220, 520, 680, 435, 515, 638, 454, 525, 230],
}, {
  name: "Sales",
  type: "line",
  data: [200, 330, 110, 130, 380, 420, 580, 335, 375, 638, 454, 480],
}]
export const Overoptions: any = {
  chart: {
    redrawOnWindowResize: true,
    height: 315,
    type: 'bar',
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 7,
      left: 0,
      blur: 1,
      color: ["transparent", 'transparent', 'rgb(227, 84, 212)'],
      opacity: 0.05,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '18%',
      borderRadius: 2
    },
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 3
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [0, 2, 2],
    curve: "smooth",
  },
  legend: {
    show: true,
    fontSize: "12px",
    position: 'bottom',
    horizontalAlign: 'center',
    fontWeight: 500,
    height: 40,
    offsetX: 0,
    offsetY: 10,
    labels: {
      colors: '#9ba5b7',
    },
    markers: {
      width: 7,
      height: 7,
      shape: "circle",
      size: 3.5,
      strokeWidth: 0,
      strokeColor: '#fff',
      fillColors: undefined,
      radius: 12,
      offsetX: 0,
      offsetY: 0
    },
  },
  colors: ['var(--primary-color)', "rgba(119, 119, 142, 0.05)", 'rgb(227, 84, 212)'],
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
      formatter: function (y: number) {
        return y.toFixed(0) + "";
      },
      show: true,
      style: {
        colors: "#8c9097",
        fontSize: '11px',
        fontWeight: 600,
        cssClass: 'apexcharts-xaxis-label',
      },
    }
  },
  xaxis: {
    type: "category",
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      rotate: -90,
      style: {
        colors: "#8c9097",
        fontSize: '11px',
        fontWeight: 600,
        cssClass: 'apexcharts-xaxis-label',
      },
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y: number) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + "%";
        }
        return y;
      },
    },
  },
  fill: {
    colors: undefined,
    opacity: 0.025,
    type: ['solid', 'solid'],
    gradient: {
      shade: 'light',
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: ['#fdc530'],
      inverseColors: true,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 50, 100],
      colorStops: ['#fdc530']
    }
  }
}

//Order Statics
export const Staticseries = [1754, 634, 878, 470]
export const Staticoptions: any = {
  chart: {
    height: 210,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    height: 52,
    markers: {
      width: 8,
      height: 8,
      radius: 2,
      shape: "circle",
      size: 4,
      strokeWidth: 0
    },
    offsetY: 24,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    // colors: "#fff",
    width: 0,
    dashArray: 0,
  },
  labels: ["Delivered", "Cancelled", "Pending", "Returned"],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      expandOnClick: false,
      donut: {
        size: '80%',
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
            fontSize: '15px',
            color: undefined,
            offsetY: -20,
            formatter: function (val: string) {
              return val + "%"
            }
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '22px',
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
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 1)", "rgba(255, 93, 159, 1)", "rgba(255, 142, 111, 1)"],
}

//Sales Statistics
export const Saleseries = [{
  name: 'Total',
  type: 'bar',
  data: [80, 90, 59, 86, 120, 165, 115]
}, {
  name: 'This Year',
  type: 'bar',
  data: [55, 25, 25, 165, 75, 64, 70]
}, {
  name: 'Last Year',
  type: 'bar',
  data: [71, 97, 72, 52, 73, 51, 71]
}
]
export const Saleoptions = {
  chart: {
    height: 265,
    type: 'line',
    stacked: true,
    toolbar: {
      show: false,
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 3
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    markers: {
      width: 4,
      height: 4,
      size:4,
      shape: "circle",
      strokeWidth: 0
    },
  },
  stroke: {
    curve: 'smooth',
    width: [0],
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      borderRadius: 3,
      borderRadiusWhenStacked: "all",
    }
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 1)", "rgba(255, 142, 111, 1)"],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

//line-graph1
export const Graphseries = [{
  name: 'Total Income',
  data: [0, 30, 10, 35, 26, 31, 14, 22, 40, 12]
}]
export const Graphoptions: any = {
  chart: {
    type: 'line',
    height: 30,
    width: 100,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      blur: 3,
      opacity: 0.2,
    }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    gradient: {
      // enabled: false
    }
  },
  // min: 0
}

//line-graph2
export const Graph2series = [{
  name: 'Total Income',
  data: [0, 20, 15, 25, 15, 25, 6, 25, 32, 15]
}]
export const Graph2options: any = {
  chart: {
    type: 'line',
    height: 30,
    width: 100,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      blur: 3,
      opacity: 0.2,
    }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    gradient: {
      // enabled: false
    }
  },
  yaxis: {
    min: 0
  },
  colors: ['rgb(227, 84, 212)'],
}

//line-graph3
export const Graph3series = [{
  name: 'Total Income',
  data: [0, 10, 30, 12, 16, 25, 4, 35, 26, 15]
}]
export const Graph3options: any = {
  chart: {
    type: 'line',
    height: 30,
    width: 100,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      blur: 3,
      opacity: 0.2,
    }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    gradient: {
      // enabled: false
    }
  },
  yaxis: {
    min: 0
  },
  colors: ['rgb(255, 93, 159)'],
}

//line-graph4
export const Graph4series = [{
  name: 'Total Income',
  data: [0, 12, 19, 26, 10, 18, 8, 17, 35, 14]
}]
export const Graph4options: any = {
  chart: {
    type: 'line',
    height: 30,
    width: 100,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      blur: 3,
      opacity: 0.2,
    }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    gradient: {
      // enabled: false
    }
  },
  yaxis: {
    min: 0
  },
  colors: ['rgb(255, 142, 111)'],
}

//line-graph5
export const Graph5series = [{
  name: 'Total Income',
  data: [0, 12, 19, 17, 35, 14, 26, 10, 18, 8]
}]
export const Graph5options: any = {
  chart: {
    type: 'line',
    height: 30,
    width: 100,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      blur: 3,
      opacity: 0.2,
    }
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    gradient: {
      // enabled: false
    }
  },
  yaxis: {
    min: 0
  },
  colors: ['rgb(158, 92, 247)'],
}

const check = <input className="form-check-input" type="checkbox" id="checkboxNoLabel02" defaultValue="" aria-label="..." defaultChecked />
const check1 = <input className="form-check-input" type="checkbox" id="checkboxNoLabel02" defaultValue="" aria-label="..." />

export const Recentorders = [
  { id: 1, src1: "../../../assets/images/faces/1.jpg", class: "Elena smith", email: "elenasmith387@gmail.com", product: "All-Purpose Cleaner", quantity: "3", amount: "$9.99", status: "In Progress", date: "03,Sep 2024", color: "primary-transparent", checked: check },
  { id: 2, src1: "../../../assets/images/faces/12.jpg", class: "Nelson Gold", email: "noahrussell556@gmail.com", product: "Kitchen Knife Set", quantity: "4", amount: "$49.99", status: "Pending", date: "26,Jul 2024", color: "primary1-transparent", checked: check1 },
  { id: 3, src1: "../../../assets/images/faces/6.jpg", class: "Grace Mitchell", email: "gracemitchell79@gmail.com", product: "Velvet Throw Blanket", quantity: "2", amount: "$29.99", status: "Success", date: "12,May 2024", color: "primary2-transparent", checked: check },
  { id: 4, src1: "../../../assets/images/faces/14.jpg", class: "Spencer Robin", email: "leophillips124@gmail.com", product: "Aromatherapy Diffuser", quantity: "4", amount: "$19.99", status: "Success", date: "15,Aug 2024", color: "primary2-transparent", checked: check },
  { id: 5, src1: "../../../assets/images/faces/3.jpg", class: "Chloe Lewis", email: "chloelewis67@gmail.com", product: "Insulated Water Bottle", quantity: "2", amount: "$14.99", status: "Pending", date: "11,Oct 2024", color: "primary3-transparent", checked: check1 },
]

//CardsData 

export const Cardsdata = [
  { id: 1, title: "Total Realtors", count: "10", inc: "Increased By ", percentageChange: "2.56%", iconClass: "ti ti-shopping-cart", icon: "ti ti-arrow-narrow-up", backgroundColor: "primary", color: "success" },
  { id: 2, title: "Properties Sold this Month", count: "17", inc: "Increased By ", percentageChange: "0.34%", iconClass: "ti ti-users", icon: "ti ti-arrow-narrow-up", backgroundColor: "primary1", color: "success" },
  { id: 3, title: "Total Properties Listed", count: "87", inc: "Increased By ", percentageChange: "7.66%", iconClass: "ti ti-currency-dollar", icon: "ti ti-arrow-narrow-up", backgroundColor: "primary2", color: "success" },
  { id: 4, title: "Average Land Price (May)", count: "172,293 BHD", inc: "Decreased By ", percentageChange: "0.74%", iconClass: "ti ti-chart-bar", icon: "ti ti-arrow-narrow-down", backgroundColor: "primary3", color: "danger" },
]

interface LatestType {
  id: number;
  product: string;
  price: string;
  status: string;
  color: string;
  src: string;
}
export const Latestdata: LatestType[] = [
  { id: 1, src: "../../../assets/images/ecommerce/jpg/4.jpg", product: "SwiftBuds", price: "$39.99", status: "Success", color: "primary" },
  { id: 2, src: "../../../assets/images/ecommerce/jpg/6.jpg", product: "CozyCloud Pillow", price: "$19.95", status: "Pending", color: "primary1" },
  { id: 3, src: "../../../assets/images/ecommerce/jpg/3.jpg", product: "AquaGrip Bottle", price: "$9.99", status: "Failed", color: "primary2" },
  { id: 4, src: "../../../assets/images/ecommerce/jpg/1.jpg", product: "GlowLite Lamp", price: "$24.99", status: "Success", color: "primary3" },
  { id: 5, src: "../../../assets/images/ecommerce/jpg/2.jpg", product: "Bitvitamin", price: "$26.45", status: "Success", color: "secondary" },
  { id: 6, src: "../../../assets/images/ecommerce/jpg/5.jpg", product: "FitTrack", price: "$49.95", status: "Success", color: "warning" },
]

interface Selling {
  id: number;
  data: string;
  heading: string;
  price: string;
  percent: string;
  color1: string;
  icon: string;
  percent1: string;
}
export const Sellingdata: Selling[] = [
  { id: 1, data: "one", heading: "Clothing", price: "31,245", percent: "25", color1: "success", icon: "up", percent1: "0.45" },
  { id: 2, data: "two", heading: "Electronics", price: "29,553", percent: "16", color1: "warning", icon: "up", percent1: "0.27" },
  { id: 3, data: "three", heading: "Grocery", price: "24,577", percent: "22", color1: "secondary", icon: "up", percent1: "0.63" },
  { id: 4, data: "four", heading: "Automobiles", price: "19,278", percent: "18", color1: "primary1", icon: "down", percent1: "1.14" },
  { id: 5, data: "five", heading: "others", price: "15,934", percent: "15", color1: "primary", icon: "up", percent1: "3.87" },
]

// Sales By Country
export const Countrydata = [
  { id: 1, src: "../../../assets/images/flags/us_flag.jpg", states: "United States", now: 90, data: "31,672", color: 'primary' },
  { id: 2, src: "../../../assets/images/flags/italy_flag.jpg", states: "Italy", now: 85, data: "29,557", color: 'primary1' },
  { id: 3, src: "../../../assets/images/flags/spain_flag.jpg", states: "Spain", now: 80, data: "24,562", color: 'primary2' },
  { id: 4, src: "../../../assets/images/flags/uae_flag.jpg", states: "Uae", now: 75, data: "21,532", color: 'primary3' },
  { id: 5, src: "../../../assets/images/flags/argentina_flag.jpg", states: "Argentina", now: 70, data: "18,753", color: 'secondary' },
  { id: 6, src: "../../../assets/images/flags/china_flag.jpg", states: "China", now: 65, data: "12,342", color: 'info' },
  { id: 7, src: "../../../assets/images/flags/french_flag.jpg", states: "French", now: 60, data: "15,533", color: 'warning' },
]

//Recent Activity

export const activityData = [
  {
    activityUser: "John Doe",
    activityTime: "12 Hrs",
    activityDesc: "Updated the product description for <span class='text-primary fw-medium'>Widget X</span>.",
  },
  {
    activityUser: "Jane Smith",
    activityTime: "4:32pm",
    activityDesc: "added a <span class='fw-medium text-dark'>new user</span> with username <span class='fw-medium text-primary1'>janesmith89.</span>",
  },
  {
    activityUser: "Michael Brown",
    activityTime: "11:45am",
    activityDesc: "Changed the status of order <a href='javascript:void(0);' class='fw-medium text-dark text-decoration-underline'>#12345</a> to <span class='fw-medium text-primary2'>Shipped.</span>",
  },
  {
    activityUser: "David Wilson",
    activityTime: "9:27am",
    activityDesc: "added <span class='fw-medium text-primary3'>John Smith</span> to academy group this day.",
  },
  {
    activityUser: "Robert Jackson",
    activityTime: "8:56pm",
    activityDesc: "added a comment to the task <span class='fw-medium text-secondary'>Update website layout.</span>",
  },
];