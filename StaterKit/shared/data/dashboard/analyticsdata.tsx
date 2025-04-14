
//Visitor Analytics
export const Analyticsseries = [
  {
    type: "line",
    name: "Viewers",
    data: [
      {
        x: "Jan",
        y: 320,
      },
      {
        x: "Feb",
        y: 560,
      },
      {
        x: "Mar",
        y: 250,
      },
      {
        x: "Apr",
        y: 486,
      },
      {
        x: "May",
        y: 310,
      },
      {
        x: "Jun",
        y: 560,
      },
      {
        x: "Jul",
        y: 560,
      },
      {
        x: "Aug",
        y: 860,
      },
      {
        x: "Sep",
        y: 400,
      },
      {
        x: "Oct",
        y: 500,
      },
      {
        x: "Nov",
        y: 350,
      },
      {
        x: "Dec",
        y: 700,
      },
    ],
  },
  {
    type: "area",
    name: "Followers",
    data: [
      {
        x: "Jan",
        y: 680,
      },
      {
        x: "Feb",
        y: 800,
      },
      {
        x: "Mar",
        y: 680,
      },
      {
        x: "Apr",
        y: 840,
      },
      {
        x: "May",
        y: 980,
      },
      {
        x: "Jun",
        y: 720,
      },
      {
        x: "Jul",
        y: 900,
      },
      {
        x: "Aug",
        y: 1000,
      },
      {
        x: "Sep",
        y: 850,
      },
      {
        x: "Oct",
        y: 950,
      },
      {
        x: "Nov",
        y: 750,
      },
      {
        x: "Dec",
        y: 860,
      },
    ],
  },
  {
    type: "bar",
    name: "Sessions",
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
        y: 180,
      },
      {
        x: "Feb",
        y: 250,
      },
      {
        x: "Mar",
        y: 300,
      },
      {
        x: "Apr",
        y: 350,
      },
      {
        x: "May",
        y: 350,
      },
      {
        x: "Jun",
        y: 250,
      },
      {
        x: "Jul",
        y: 150,
      },
      {
        x: "Aug",
        y: 250,
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
        y: 250,
      },
      {
        x: "Dec",
        y: 200,
      },
    ],
  },
]
export const Analyticsoptions: any = {
  chart: {
    type: "area",
    height: 398,
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
      blur: 3,
      color: "#000",
      opacity: 0.1,
    },
  },
  colors: ["rgba(227, 84, 212, 1)", "rgba(255, 93, 159, 0.25)", "var(--primary-color)"],
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
  },
  markers: {
    size: 6,
    hover: {
      size: 6
    },
    discrete: [{
      seriesIndex: 0,
      dataPointIndex: 1,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 2,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 3,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 4,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 5,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 6,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 7,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 8,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 9,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 10,
      fillColor: '#fff',
      strokeColor: 'rgb(227, 84, 212)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 1,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 2,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 3,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 4,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 5,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 6,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 7,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 8,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 9,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    {
      seriesIndex: 1,
      dataPointIndex: 10,
      fillColor: '#fff',
      strokeColor: 'rgb(255, 93, 159)',
      size: 3,
      shape: "circle"
    },
    ],
  },
  fill: {
    type: ['soild', 'gradient', 'soild'],
    gradient: {
      opacityFrom: 0.05,
      opacityTo: 0.05,
      shadeIntensity: 0.1,
    },
  },
  stroke: {
    curve: ["smooth", "stepline", "smooth"],
    width: [2, 2, 2],
    dashArray: [0, 0, 0, 0],
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: function (value: string) {
        return "$" + value;
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "20%",
      borderRadius: "2",
    },
  },
  tooltip: {
    y: [
      {
        formatter: function (e: number | undefined) {
          return void 0 !== e ? e.toFixed(0) : e;
        },
      },
      {
        formatter: function (e: number | undefined) {
          return void 0 !== e ? e.toFixed(0) : e;
        },
      },
      {
        formatter: function (e: number | undefined) {
          return void 0 !== e ? e.toFixed(0) : e;
        },
      },
    ],
  },
  legend: {
    show: true,
    position: "top",
    inverseOrder: true,
    markers: {
      size: 5,
      shape: "circle",
      strokeWidth: 0
    }
  },
}

// Site Referrals
export const Siteseries = [300, 450, 200, 150, 100]
export const Siteoptions: any = {
  chart: {
    height: 290,
    type: "donut",
  },
  labels: ["Search Engines", "Social Media", "Direct", "Referral Sites", "Email"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  colors: [
    "rgb(227, 84, 212)",
    "var(--primary-color)",
    "rgb(255, 93, 159)",
    "rgb(255, 142, 111)",
    "rgb(158, 92, 247)",
  ],
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: "75%",
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
}

//Sales Growth Rate
export const Growthseries = [{
  name: 'Last Year',
  data: [35, 36, 22, 44, 48, 37, 36, 26, 27, 33, 32, 36]
}, {
  name: 'This Year',
  data: [55, 53, 46, 40, 45, 38, 46, 37, 22, 34, 40, 44,]
},
]
export const Growthoptions: any = {
  chart: {
    type: 'line',
    height: 188,
    stacked: true,
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: false
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 6,
      left: 1,
      blur: 4,
      color: '#000',
      opacity: 0.12
    },
  },
  grid: {
    show: true,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: 2,
      right: 2,
      bottom: 2,
      left: 2
    },
    borderColor: '#f1f1f1',
    strokeDashArray: 3
  },
  markers: {
    size: 4,
    hover: {
      size: 3
    },
  },
  colors: ["rgba(227, 84, 212, 1)", "var(--primary-color)"],
  stroke: {
    curve: 'straight',
    width: 2,
    dashArray: 2
  },
  legend: {
    show: true,
    position: "bottom",
    fontSize: '10px',
    fontFamily: 'Poppins',
    markers: {
      size: 3.5,
      shape: "circle",
      strokeWidth: 0
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      // borderType: "solid",
      color: "rgba(119, 119, 142, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
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
      show: false,
      formatter: function (y: number) {
        return y.toFixed(0) + "";
      }
    }
  },
  xaxis: {
    // type: 'month',
    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    axisBorder: {
      show: true,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    title: {
      style: {
        color: '#adb5be',
        fontSize: '5px',
        fontFamily: 'poppins, sans-serif',
        fontWeight: 600,
        cssClass: 'apexcharts-yaxis-label',
      },
    },
  },
}

//chart-21

const ChartGradientSettings = {
  totalFollowers: {
    gradientToColors: ['var(--primary01)'],
    colorStops: [
      { offset: 0, color: "var(--primary04)", opacity: 1 },
      { offset: 55, color: "var(--primary01)", opacity: 0.1 },
      { offset: 100, color: "var(--primary05)", opacity: 0.3 }
    ],
  },
  sessionRate: {
    gradientToColors: ['rgba(227, 84, 212, 0.4)'],
    colorStops: [
      { offset: 0, color: "rgba(227, 84, 212, 0.4)", opacity: 1 },
      { offset: 55, color: "rgba(227, 84, 212, 0.1)", opacity: 0.1 },
      { offset: 100, color: "rgba(227, 84, 212, 0.5)", opacity: 0.3 },
    ],
  },
  conversionRate: {
    gradientToColors: ['rgba(255, 93, 159, 0.1)'],
    colorStops: [
      { offset: 0, color: "rgba(255, 93, 159, 0.4)", opacity: 1 },
      { offset: 50, color: "rgba(255, 93, 159, 0.1)", opacity: 0.5 },
      { offset: 100, color: "rgba(255, 93, 159, 0.5)", opacity: 0.3 },
    ],
  },
  totalReview: {
    gradientToColors: ['rgba(255, 142, 111, 0.1'],
    colorStops: [
      { offset: 0, color: "rgba(255, 142, 111, 0.4)", opacity: 1 },
      { offset: 50, color: "rgba(255, 142, 111, 0.1)", opacity: 0.5 },
      { offset: 100, color: "rgba(255, 142, 111, 0.5)", opacity: 0.3 },
    ],
  },
};
const Chartseries = [
  {
    data: [1, 20, 15, 35, 30, 25, 55, 45, 65],
  },
]
const ChartOptionsTemplate = ({ color, gradientSettings }: any) => ({
  chart: {
    height: 85,
    width: 100,
    type: 'area',
    zoom: {
      enabled: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: () => '',
      },
    },
    marker: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: 'transparent',
  },
  xaxis: {
    crosshairs: {
      show: false,
    },
  },
  yaxis: {
    max: 65,
  },
  colors: [color], // Use the passed color
  stroke: {
    curve: "smooth",
    width: [.75],
  },
  fill: {
    opacity: 0.001,
    type: ['gradient'],
    gradient: {
      shade: 'light',
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: gradientSettings.gradientToColors,
      colorStops: gradientSettings.colorStops,
      inverseColors: true,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 50, 100],
    },
  },
});

export const AnalayticsCards = [
  { id: 1, chartOptions: ChartOptionsTemplate({ color: 'var(--primary-color)', gradientSettings: ChartGradientSettings.totalFollowers }), chartSeries: Chartseries, Icon: "bx-group", title: "Total Followers", Inc: "Increased By ", percentageChange: "2.62", value: "13,124", color: "primary", Icon1: "arrow-narrow-up", type: 'area', textColor: "success" },
  { id: 2, chartOptions: ChartOptionsTemplate({ color: 'rgb(227, 84, 212)', gradientSettings: ChartGradientSettings.sessionRate }), chartSeries: Chartseries, Icon: "bx-trending-up", title: "Session Rate", Inc: "Increased By ", percentageChange: "0.56", value: "11,287", color: "primary1", Icon1: "arrow-narrow-up", type: 'area', textColor: "success" },
  { id: 3, chartOptions: ChartOptionsTemplate({ color: 'rgb(255, 93, 159)', gradientSettings: ChartGradientSettings.conversionRate }), chartSeries: Chartseries, Icon: "bx-dollar", title: "Conversion Rate", Inc: "Decreased By ", percentageChange: "3.76", value: "17,658", color: "primary2", Icon1: "arrow-narrow-down", type: 'area', textColor: "danger" },
  { id: 4, chartOptions: ChartOptionsTemplate({ color: 'rgb(255, 142, 111)', gradientSettings: ChartGradientSettings.totalReview }), chartSeries: Chartseries, Icon: "bx-like", title: "Total Review", Inc: "Increased By ", percentageChange: "2.57", value: "5,124", color: "primary3", Icon1: "arrow-narrow-up", type: 'area', textColor: "success" },
];


interface Visitor {
  id: number;
  total: string;
  duration: string;
  new: string;
  return: string;
  bounce: string;
  conversion: string;
  avg: string;
  top: string;
  color: string;
  color1: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
}
export const Visitordata: Visitor[] = [
  { id: 1, total: "32,190", duration: "15m 30s", new: "12,345", return: "19,845", bounce: "45", conversion: "3.5", avg: "3m 45s", top: "Google, Facebook", color: "success", color1: "danger", color3: "", color4: "", color5: "", color6: '' },
  { id: 2, total: "28,674", duration: "13m 25s", new: "10,432", return: "18,242", bounce: "47", conversion: "3.8", avg: "3m 10s", top: "Twitter, LinkedIn", color: "", color1: "", color3: "warning", color4: "", color5: "", color6: '' },
  { id: 3, total: "35,789", duration: "16m 10s", new: "13,567", return: "22,222", bounce: "43", conversion: "3.2", avg: "4m 05s", top: "Bing, YouTube", color: "", color1: "", color3: "", color4: "warning", color5: "success", color6: '' },
  { id: 4, total: "30,234", duration: "14m 50s", new: "11,678", return: "18,556", bounce: "46", conversion: "3.6", avg: "3m 30s", top: "Instagram, Reddit", color: "", color1: "", color3: "", color4: "", color5: "", color6: '' },
  { id: 5, total: "33,456", duration: "15m 45s", new: "12,890", return: "20,566", bounce: "44", conversion: "3.4", avg: "3m 55s", top: "Yahoo, Pinterest", color: "danger", color1: "", color3: "", color4: "", color5: "", color6: 'success' },
]

interface Countries {
  id: number;
  src: string;
  header: string;
  percent: string;
  icon: string;
  color: string;
  data: string;
  marginclass: string;
}
export const Countriesdata: Countries[] = [
  { id: 1, src: "../../../assets/images/flags/us_flag.jpg",marginclass:"mb-4", header: "United States", percent: "5.1", icon: "up", color: "success", data: "26,890" },
  { id: 2, src: "../../../assets/images/flags/germany_flag.jpg",marginclass:"mb-4", header: "Germany", percent: "1.3", icon: "up", color: "success", data: "12,345" },
  { id: 3, src: "../../../assets/images/flags/spain_flag.jpg",marginclass:"mb-4", header: "Spain", percent: "2.7", icon: "up", color: "success", data: "18,765" },
  { id: 4, src: "../../../assets/images/flags/china_flag.jpg",marginclass:"mb-4", header: "China", percent: "1.0", icon: "down", color: "danger", data: "9,874" },
  { id: 5, src: "../../../assets/images/flags/mexico_flag.jpg",marginclass:"mb-4", header: "Mexico", percent: "2.7", icon: "up", color: "success", data: "21,456" },
  { id: 6, src: "../../../assets/images/flags/canada_flag.jpg",marginclass:"mb-4", header: "Canada", percent: "2.1", icon: "up", color: "success", data: "28,976" },
  { id: 7, src: "../../../assets/images/flags/argentina_flag.jpg",marginclass:"mb-4", header: "Argentina", percent: "5.4", icon: "up", color: "success", data: "21,456" },
  { id: 8, src: "../../../assets/images/flags/singapore_flag.jpg",marginclass:"mb-4", header: "Singapore", percent: "0.7", icon: "up", color: "success", data: "16,789" },
  { id: 9, src: "../../../assets/images/flags/italy_flag.jpg",marginclass:"", header: "Italy", percent: "0.3", icon: "down", color: "danger", data: "21,456" },
]

interface Activity {
  id: number;
  icon: string;
  color: string;
  header: string;
  inc: string;
  percent: string;
  icon1: string;
  data?: string;
  color1?: string;
}
export const Activitydata = [
  { id: 1, icon: "ri-timer-2-line", color: "primary", header: "Avg. Session Duration", inc: "Increased by", percent: "5.2", icon1: "up", data: "2m 35s", color1: "success" },
  { id: 2, icon: "ri-user-add-line fs-18", color: "primary1", header: "New Users", inc: "Increased by", percent: "10.3", icon1: "up", data: "5,621", color1: "success" },
  { id: 3, icon: "ri-eye-line fs-18", color: "primary2", header: "Page Views", inc: "Decreased by ", percent: "2.15", icon1: "down", data: "45,890", color1: "danger" },
  { id: 4, icon: "ri-line-chart-line fs-18", color: "primary3", header: "Conversion Rate", inc: "Increased by", percent: "1.5", icon1: "up", data: "4.8%", color1: "success" },
  { id: 5, icon: "ri-arrow-down-s-line fs-18", color: "secondary", header: "Bounce Rate", inc: "Decreased by ", percent: "3.8", icon1: "down", data: "32.5%", color1: "danger" },
  { id: 6, icon: "ri-user-line fs-18", color: "warning", header: "Returning Visitors", inc: "Increased by", percent: "7.2", icon1: "up", data: "8,932", color1: "success" },
  { id: 7, icon: "ri-money-dollar-circle-line fs-18", color: "info", header: "Avg. Order Value", inc: "Decreased by", percent: "2.7", icon1: "down", data: "$56.78", color1: "danger" },
]

// Top Landing Pages
export const Toplandingdata = [
  { id: 1, data: 'main/landing-page/home', visit: "2,345 Visits", now: 50, color: "primary" },
  { id: 2, data: 'main/landing-page/products/popular-category', visit: "1,987 Visits", now: 30, color: "pink" },
  { id: 3, data: 'main/landing-page/blog/latest-article', visit: "1,532 Visits", now: 20, color: "primary" },
  { id: 4, data: 'main/landing-page/about-us/team-page', visit: "1,254 Visits", now: 40, color: "orange" },
  { id: 5, data: 'main/landing-page/about-us/profile', visit: "1,103 Visits", now: 40, color: "orange" },
  { id: 6, data: 'main/landing-page/contact/support', visit: "985 Visits", now: 60, color: "info" },
]