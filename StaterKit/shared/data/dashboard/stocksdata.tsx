import SpkStockCard from "@/shared/@spk-reusable-components/reusable-dashboards/spk-stockcard";

function generateDayWiseTimeSeries(baseval: string | number | Date, count: number, yrange: { min: any; max: any; }) {
  const series = [];
  let currentDate = new Date(baseval);

  for (let i = 0; i < count; i++) {
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: currentDate.getTime(),
      y: y
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return series;
}
const data = generateDayWiseTimeSeries(new Date("22 Apr 2024").getTime(), 115, {
  min: 30,
  max: 90
});
export const Stockareaseries = [
  {
    name: 'Investment',
    data: data
  }
]
export const Stockareaoptions: any = {
  chart: {
    id: "chart2",
    type: "area",
    height: 200,
    foreColor: "#ccc",
    toolbar: {
      autoSelected: "pan",
      show: false
    }
  },
  colors: ["var(--primary-color)"],
  stroke: {
    width: 3
  },
  grid: {
    borderColor: "#555",
    // clipMarkers: [false],
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    gradient: {
      // enabled: true,
      opacityFrom: 0.1,
      opacityTo: 0
    }
  },
  markers: {
    size: 3,
    colors: ["#fff"],
    strokeColors: ["rgb(227, 84, 212)"],
    strokeWidth: 2
  },
  tooltip: {
    theme: "dark"
  },
  xaxis: {
    type: "datetime"
  },
  yaxis: {
    min: 0,
    tickAmount: 4
  }
}

//stockCap
const data1 = generateDayWiseTimeSeries(new Date("22 Apr 2024").getTime(), 115, {
  min: 30,
  max: 90
});
export const Stockseries = [
  {
    name: 'Market Cap',
    data: data1
  }
];
export const Stockoptions = {
  chart: {
    id: "chart1",
    height: 130,
    type: "bar",
    foreColor: "#ccc",
    brush: {
      target: "chart2",
      enabled: true
    },
    selection: {
      enabled: true,
      fill: {
        color: "#fff",
        opacity: 0.4
      },
      xaxis: {
        min: new Date("24 Jun 2024 10:00:00").getTime(),
        max: new Date("10 Jul 2024 10:00:00").getTime()
      }
    }
  },
  colors: ["rgba(227, 84, 212, 0.7)"],
  series: [
    {
      name: 'Market Cap',
      data: data1
    }
  ],
  stroke: {
    width: 2
  },
  grid: {
    borderColor: "#444"
  },
  markers: {
    size: 0
  },
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    tickAmount: 2
  }
}

//portfolio
export const Portseries = [1624, 1267, 1153]
export const Portoptions: any = {
  chart: {
    height: 288,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  labels: ["Stocks","Funds","Bond"],
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    color: "#fff",
    width: 0,
    dashArray: 0,
  },
  fill: {
    type: 'solid',
  },
  plotOptions: {

    pie: {
      expandOnClick: false,
      donut: {
        size: '78%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '20px',
            color: '#495057',
            offsetY: -4
          },
          value: {
            show: true,
            fontSize: '18px',
            color: undefined,
            offsetY: 8,
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
  colors: ["var(--primary-color)", "rgb(227, 84, 212)", "rgb(255, 93, 159)"],
}

//visitors-report
export const Visiseries = [
  {
    name: "This Week",
    data: [25, 50, 30, 55, 20, 45, 30],
    type: 'column',
  },
  {
    name: "Last Week",
    data: [35, 25, 40, 30, 45, 35, 60],
    type: 'column',
  }
]
export const Visioptions: any = {
  chart: {
    height: 267,
    type: 'line',
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 7,
      left: 0,
      blur: 1,
      // color: ["transparent", "rgb(227, 84, 212)"],
      opacity: 0.05,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '35%',
      // borderRadius: [2],
    }
  },
  colors: ['var(--primary-color)', 'rgb(227, 84, 212)'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    dashArray: [0, 0],
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  yaxis: {
    show: false,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    }
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    // show: false,
    axisBorder: {
      show: false,
      color: 'rgba(119, 119, 142, 0.05)',
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
      borderType: 'solid',
      color: 'rgba(119, 119, 142, 0.05)',
      // width: 6,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      rotate: -90,
    }
  },
  legend: {
    show: true,
    position: "bottom",
    offsetX: 0,
    offsetY: 8,
    markers: {
      // width: 8,
      // height: 8,
      strokeWidth: 0,
      strokeColor: '#fff',
      fillColors: undefined,
      // radius: 12,
      customHTML: undefined,
      onClick: undefined,
      offsetX: 0,
      offsetY: 0
    },
  },
}

//apple-change
const Tablesries = [{
  name: "Value",
  data: [
    0, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53,
    61, 27, 54, 43, 19, 46,
  ],
},]
const Wishlistoptions: any = ({ color }: any) => ({
  chart: {
    type: "line",
    height: 30,
    width: 50,
    sparkline: {
      enabled: true,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 0,
      left: 0,
      blur: 3,
      color: "rgb(227, 84, 212)",
      opacity: 0.1,
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    colors: undefined,
    width: 1.2,
    dashArray: 0,
  },
  fill: {
    opacity: 0.2,
    gradient: {
      opacityFrom: 0.00,
      opacityTo: 0.0,
      shadeIntensity: 0.0,
    },
  },
  colors: [color],
  tooltip: {
    enabled: false,
  },
  yaxis: {
    min: 0,
    show: false,
    axisBorder: {
      show: false,
    },
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
  }
})

export const Wishlistdata = [
  { id: 1, src: "../../../assets/images/media/apps/apple.png", color: "primary1", head: "Apple", subhead: "AAPL", chart: Wishlistoptions({ color: 'rgb(227, 84, 212)' }), series: Tablesries, price: "150.20", percent: "+1.50",invert: "", color1: "success" },
  { id: 2, src: "../../../assets/images/media/apps/google.png", color: "primary2", head: "Google", subhead: "GOOG", chart: Wishlistoptions({ color: 'rgba(255, 93, 159, 1)' }), series: Tablesries, price: "2,500.5", percent: "-5.25",invert: "", color1: "danger" },
  { id: 3, src: "../../../assets/images/media/apps/microsoft.png", color: "primary3", head: "Microsoft", subhead: "MSFT", chart: Wishlistoptions({ color: 'rgba(14, 165, 232, 1)' }), series: Tablesries, price: "300.75", percent: "+2.30",invert: "", color1: "success" },
  { id: 4, src: "../../../assets/images/media/apps/amazon.png", color: "secondary", head: "Amazon", subhead: "AMZN", chart: Wishlistoptions({ color: 'rgba(255, 198, 8, 1)' }), series: Tablesries, price: "3,000.00", percent: "-10.50",invert: "", color1: "danger" },
  { id: 5, src: "../../../assets/images/media/apps/tesla.png", color: "warning", head: "Tesla", subhead: "TSLA", chart: Wishlistoptions({ color: 'rgba(158, 92, 247, 1)' }), series: Tablesries, price: "700.80", percent: "+8.00",invert: "invert-1", color1: "success" },
  { id: 6, src: "../../../assets/images/media/apps/facebook.png", color: "info", head: "Facebook", subhead: "FB", chart: Wishlistoptions({ color: 'rgb(227, 84, 212)' }), series: Tablesries, price: "350.40", percent: "-3.20",invert: "", color1: "danger" },
  { id: 7, src: "../../../assets/images/media/apps/nvidia.png", color: "success", head: "Nvidia", subhead: "NVDA", chart: Wishlistoptions({ color: 'rgba(33, 206, 158, 1)' }), series: Tablesries, price: "800.60", percent: "+5.75",invert: "", color1: "success" },
]

interface Stock {
  id: number;
  icon: string;
  color: string;
  stock: string;
  stock1: string;
  qnty: string;
  price: string;
  chnage: string;
  total: string;
  color1: string;
  icon1: string;
}
export const Srockdata: Stock[] = [
  { id: 1, icon: "github-fill", color: "primary", stock: "Gituhb, Demo Inc", stock1: "GTHB", qnty: "100", price: "$145.20", chnage: "+$1,230.00", total: "$14,520.00", color1: "success", icon1: 'github-fill' },
  { id: 2, icon: "amazon-fill", color: "primary1", stock: "Amazon.com Inc.", stock1: "AMZN", qnty: "50", price: "$3,500.00", chnage: "-$5,500.00	", total: "$175,000.00", color1: "danger", icon1: 'amazon-fill' },
  { id: 3, icon: "microsoft-fill", color: "primary2", stock: "Microsoft Corporation", stock1: "MSFT", qnty: "75", price: "$265.75", chnage: "+$876.25", total: "$19,931.25", color1: "success", icon1: 'microsoft-fill' },
  { id: 4, icon: "google-fill", color: "primary3", stock: "Alphabet Inc. (Google)", stock1: "GOOGL", qnty: "30", price: "$2,550.00", chnage: "+$1,800.00", total: "$76,500.00", color1: "success", icon1: 'google-fill' },
  { id: 5, icon: "facebook-circle-fill", color: "info", stock: "Facebook, Inc.", stock1: "FB", qnty: "60", price: "$325.60", chnage: "-$364.00", total: "$19,536.00", color1: "danger", icon1: 'facebook-circle-fill' },
]

const src1 = <img src="../../../assets/images/media/apps/apple.png" alt="" className="invert-1" />
const src2 = <img src="../../../assets/images/media/apps/google.png" alt="" className="invert-1" />
const src3 = <img src="../../../assets/images/media/apps/tesla.png" alt="" className="invert-1" />
const src4 = <img src="../../../assets/images/media/apps/microsoft.png" alt="" className="invert-1" />
const src5 = <i className="ri-netflix-line"></i>

export const Transactiondata = [
  { id: 1, date: "12 Apr, 2024", stock: "APPL - Apple Inc.", shares: "50", type: "Buy", price: "$150.00", value: " $7,500.00", change: "+2%", src: src1, color: "primary1", color1: "dark", color2: "primary", color3: "success" },
  { id: 2, date: "14 Apr, 2024", stock: "GOOGL-Alphabet Inc.", shares: "20", type: "Sell", price: "$2,400.00", value: "$48,000.00", change: "-1.5%", src: src2, color: "primary2", color1: "primary2", color2: "primary1", color3: "danger" },
  { id: 3, date: "18 Apr, 2024", stock: "TSLA - Tesla Inc.", shares: "15", type: "Buy", price: "$650.00", value: "$9,750.00", change: "+1.2%", src: src3, color: "warning", color1: "warning", color2: "primary", color3: "success" },
  { id: 4, date: "20 Apr, 2024", stock: "MSFT - Microsoft Corp.", shares: "30", type: "Sell", price: "$280.00", value: "$8,400.00", change: "-0.8%", src: src4, color: "primary3", color1: "primary3", color2: "primary1", color3: "danger" },
  { id: 5, date: "22 Apr, 2024", stock: "NFLX - Netflix Inc.", shares: "25", type: "Buy", price: "$500.00", value: "$12,500.00", change: "+0.5%", src: src5, color: "danger", color1: "danger", color2: "primary", color3: "success" },
]

interface Market {
  id: number;
  symbol: string;
  cmnyname: string;
  change: string;
  price: string;
  change1: string;
  volume: string;
  color: string;
}
export const Marketdata: Market[] = [
  { id: 1, symbol: "AAPL", cmnyname: "Apple Inc.", change: "$5.00", price: "$150.00", change1: "+3.45%", volume: "1,000,000", color: "success" },
  { id: 2, symbol: "GOOGL", cmnyname: "Alphabet Inc.", change: "-$10.00", price: "$2,500.00", change1: "-0.40%", volume: "500,000", color: "danger" },
  { id: 3, symbol: "MSFT", cmnyname: "Microsoft Corporation", change: "$3.00", price: "$300.00", change1: "+1.01%", volume: "800,000", color: "success" },
  { id: 4, symbol: "TSLA", cmnyname: "Tesla, Inc.", change: "$20.00", price: "$700.00", change1: "+2.94%", volume: "1,200,000", color: "success" },
  { id: 5, symbol: "NFLX", cmnyname: "Netflix, Inc.", change: "-$5.00", price: "$400.00", change1: "-1.23%", volume: "600,000", color: "danger" },
  { id: 6, symbol: "AMZN", cmnyname: "Amazon.com, Inc.", change: "$50.00", price: "$3,000.00", change1: "+1.69%", volume: "1,500,000", color: "success" },
  { id: 7, symbol: "FB", cmnyname: "Facebook.com, Inc.", change: "$24.00", price: "$6,000.00", change1: "+2.08%", volume: "2,258,450", color: "success" },
]

//stock-1
const S1series = [{
  name: 'Value',
  data: [15, 42, 22, 42, 35, 32, 56, 35]
}]
const S1options: any = ({ color }: any) => ({
  chart: {
    type: 'line',
    height: 70,
    width: 120,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: false,
      enabledOnSeries: undefined,
      top: 0,
      left: 0,
      blur: 3,
      color: '#000',
      opacity: 0.1
    }
  },
  grid: {
    show: false,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
  },
  stroke: {
    show: true,
    curve: 'straight',
    lineCap: 'butt',
    colors: undefined,
    width: 1.5,
    dashArray: 2,
  },
  fill: {
    gradient: {
      enabled: false
    }
  },
  yaxis: {
    min: 0,
    show: false,
    axisBorder: {
      show: false
    },
  },
  xaxis: {
    show: false,
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    }
  },
  colors: [color],
})

const stocks = [
  {
    name: "Apple",
    symbol: "AAPL",
    currentValue: "$1,780.80",
    change: "+0.14%",
    changeColor: "text-success",
    icon: "bi bi-apple text-dark",
    chartOptions: S1options({ color: "rgba(33, 206, 158, 0.4)" }),
    chartSeries: S1series,
    color: 'dark',
    type: "line",
    icon1: 'up'
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    currentValue: "$58,151.02",
    change: "-2.14%",
    changeColor: "text-danger",
    icon: "bi bi-currency-bitcoin text-warning",
    chartOptions: S1options({ color: "rgba(251, 66, 66, 0.4)" }),
    chartSeries: S1series,
    color: 'warning',
    type: "line",
    icon1: 'down'
  },
  {
    name: "Tesla",
    symbol: "TSLA",
    currentValue: "$4,125.63",
    change: "+4.02%",
    changeColor: "text-success",
    icon: "bi bi-card-list text-primary1",
    chartOptions: S1options({ color: "rgba(33, 206, 158, 0.4)" }),
    chartSeries: S1series,
    color: 'primary1',
    type: "line",
    icon1: 'up'
  },
  {
    name: "Amazon",
    symbol: "AMZN",
    currentValue: "$63,251.11",
    change: "-5.14%",
    changeColor: "text-danger",
    icon: "bi bi-gift text-primary2",
    chartOptions: S1options({ color: "rgba(251, 66, 66, 0.4)" }),
    chartSeries: S1series,
    color: 'primary2',
    type: "line",
    icon1: 'down'
  },
  {
    name: "Aliexpress",
    symbol: "AE",
    currentValue: "$5,401.50",
    change: "+1.14%",
    changeColor: "text-success",
    icon: "bi bi-truck text-primary3",
    chartOptions: S1options({ color: "rgba(33, 206, 158, 0.4)" }),
    chartSeries: S1series,
    color: 'primary3',
    type: "line",
    icon1: 'up'
  },
  {
    name: "Samsung",
    symbol: "SSNLF",
    currentValue: "$10,732.12",
    change: "+2.14%",
    changeColor: "text-success",
    icon: "bi bi-phone text-secondary",
    chartOptions: S1options({ color: "rgba(33, 206, 158, 0.4)" }),
    chartSeries: S1series,
    color: 'secondary',
    type: "line",
    icon1: 'up'
  },
  {
    name: "Nvidia",
    symbol: "NVDA",
    currentValue: "$23,235.25",
    change: "-2.13%",
    changeColor: "text-danger",
    icon: "bi bi-nvidia text-info",
    chartOptions: S1options({ color: "rgba(251, 66, 66, 0.4)" }),
    chartSeries: S1series,
    color: 'info',
    type: "line",
    icon1: 'down'
  },
];

export const StockSlides = stocks.map((stock, index) => (
  <div key={index}>
    <SpkStockCard stock={stock} width={120} height={70} />
  </div>
))