

import Link from "next/link";

//Sales Report
export const Reportseries = [
  {
    name: "Sales",
    data: [20, 42, 28, 79, 68, 84, 48, 65, 45, 80, 25, 75],
    type: "line",
  },
  {
    name: "Profit",
    data: [10, 39, 25, 74, 58, 80, 42, 58, 31, 71, 10, 82],
    type: "area",
  },
  {
    name: "Expenses",
    data: [38, 53, 34, 33, 30, 28, 39, 36, 32, 40, 22, 74],
    type: "bar",
  },
]
export const Reportoptions = {
  chart: {
    height: 404,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 10,
      left: 0,
      blur: 1,
      color: "rgba(0, 0, 0, 0.1)",
      opacity: 0.3,
    },
  },
  grid: {
    show: true,
    borderColor: "rgba(119, 119, 142, 0.1)",
    strokeDashArray: 4,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [1.5, 1.5, 1],
    curve: ["smooth", "straight"],
    dashArray: [4, 4, 0],
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "center",
    fontWeight: 600,
    fontSize: "11px",
    tooltipHoverFormatter: function (val: string, opts: { w: { globals: { series: { [x: string]: { [x: string]: string; }; }; }; }; seriesIndex: string | number; dataPointIndex: string | number; }) {
      return (
        val +
        " - " +
        opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
        ""
      );
    },
    labels: {
      colors: "#74767c",
    },
    markers: {
      width: 8,
      height: 8,
      size:4,
      strokeWidth: 0,
      radius: 12,
      offsetX: 0,
      offsetY: 0,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 6,
      borderRadiusApplication: "all",
      borderRadiusWhenStacked: "last",
      columnWidth: "15%",
    },
  },
  fill: {
    type: ['soild', 'soild', 'soild'],
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 1,
    },
  },
  colors: ["rgba(227, 84, 212, 1)", "rgba(255, 93, 159, 0.06)", "var(--primary-color)"],
  yaxis: {
    title: {
      style: {
        color: "#adb5be",
        fontSize: "14px",
        fontFamily: "poppins, sans-serif",
        fontWeight: 600,
        cssClass: "apexcharts-yaxis-label",
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
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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
      rotate: -90,
      style: {
        colors: "#8c9097",
        fontSize: "11px",
        fontWeight: 600,
        cssClass: "apexcharts-xaxis-label",
      },
    },
  },
}

//Total Orders
export const Orderseries = [92]
export const Orderoptions = {
  chart: {
    height: 325,
    type: 'radialBar',
    // responsive: 'true',
    offsetX: 0,
    offsetY: 15,
  },
  labels: ["Orders"],
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      size: 120,
      imageWidth: 50,
      imageHeight: 50,
      track: {
        strokeWidth: '97%',
        // strokeWidth: "0",
      },
      dropShadow: {
        enabled: false,
        top: 0,
        left: 0,
        bottom: 0,
        blur: 3,
        opacity: 0.5
      },
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 30,
        },
        // hollow: {
        //     size: "60%"
        // },
        value: {
          offsetY: -10,
          fontSize: '22px',
          color: undefined,
          formatter: function (val: string) {
            return val + "%";
          }
        }
      }
    }
  },
  colors: ['var(--primary-color)'],
  fill: {
    type: "solid",
    gradient: {
      shade: "dark",
      type: "horizontal",
      shadeIntensity: .5,
      gradientToColors: ["#b94eed"],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  stroke: {
    dashArray: 3
  },
}

//New Visitors
export const Visitorseries = [{
  name: 'Total Projects',
  data: [120, 200, 150, 300, 250, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1542],
},]
export const Visitoroptions = {
  chart: {
    stacked: true,
    type: 'bar',
    height: 190,
    toolbar: {
      show: false,
    },
  },
  grid: {
    show: false,
    borderColor: '#f2f6f7',
  },
  colors: ["var(--primary-color)"],
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 2,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'all',
      colors: {
        ranges: [{
          from: -100,
          to: -46,
          color: 'var(--primary-color)'
        }, {
          from: -45,
          to: 0,
          color: 'var(--primary-color)'
        }]
      },

    }
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
    position: 'top',
  },
  yaxis: {
    show: false,
    labels: {
      show: false,
    }
  },
  xaxis: {
    // show: false,
    type: 'category',
    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    axisBorder: {
      show: false,
      color: 'rgba(119, 119, 142, 0.05)',
      offsetX: 0,
      offsetY: 0,
    },
  }
}
const svg1 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0ZM239.86,98.11,226,202.12A16,16,0,0,1,210.13,216H45.87A16,16,0,0,1,30,202.12l-13.87-104A16,16,0,0,1,32,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H224a16,16,0,0,1,15.85,18.11ZM89.63,80h76.74L128,36.15ZM224,96H32L45.87,200H210.13Zm-51.16,23.2-5.6,56A8,8,0,0,0,174.4,184a7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.16-8.76Z"></path></svg>
const svg2 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z"></path></svg>
const svg3 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path></svg>
const svg4 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path></svg>
export const Ecommercecard = [
  { id: 1, title: "Total Sales", count: "15,432", inc: "Increased By", percentageChange: "5.1%", icon: "ti ti-trending-up", svgIcon: svg1, backgroundColor: "primary svg-white", color: "success" },
  { id: 2, title: "Revenue", count: "$245,147", inc: "Increased By", percentageChange: "0.6%", icon: "ti ti-trending-up", svgIcon: svg2, backgroundColor: "primary1 svg-white", color: "success" },
  { id: 3, title: "Average Order Value", count: "$120", inc: "Increased By", percentageChange: "1.08%", icon: "ti ti-trending-down", svgIcon: svg3, backgroundColor: "primary2 svg-white", color: "danger" },
  { id: 4, title: "Total Orders", count: "1,25,032", inc: "Decreased By", percentageChange: "2.3%", icon: "ti ti-trending-up", svgIcon: svg4, backgroundColor: "primary3 svg-white", color: "success" },
]

interface Topselling {
  id: number;
  src: string;
  header: string;
  data: string;
  price: string;
  sales: string;
}
export const TopSellingdata: Topselling[] = [
  { id: 1, src: "../../../assets/images/ecommerce/png/6.png", header: "Chair with Cushion", data: "Furniture", price: "$124", sales: "260 Sales" },
  { id: 2, src: "../../../assets/images/ecommerce/png/7.png", header: "Hand Bag", data: "Accessories", price: "$564", sales: "181 Sales" },
  { id: 3, src: "../../../assets/images/ecommerce/png/28.png", header: "Sneakers", data: "Sports", price: "$964", sales: "134 Sales" },
  { id: 4, src: "../../../assets/images/ecommerce/png/11.png", header: "Ron Hoodie", data: "Fashion", price: "$769", sales: "127 Sales" },
  { id: 5, src: "../../../assets/images/ecommerce/png/23.png", header: "Smart Watch", data: "Electronics", price: "$999", sales: "108 Sales" },
]

export const Newlydata = [
  { id: 1, product: "#1547988", prdtname: "Sweater Coat", src: "../../../assets/images/ecommerce/png/12.png", category: "Women's wear", discount: "40", price: "$241.08", status: "Published", date: "15-05-2024", color: "success" },
  { id: 2, product: "#1415023", prdtname: "Cushion Chair", src: "../../../assets/images/ecommerce/png/6.png", category: "Furniture", discount: "30", price: "$1,489.00", status: "Pending", date: "20-05-2024", color: "warning" },
  { id: 3, product: "#4578162", prdtname: "Smart Watch", src: "../../../assets/images/ecommerce/png/23.png", category: "Gadgets", discount: "10", price: "$2,457.08", status: "Saved as Draft", date: "06-02-2024", color: "info" },
  { id: 4, product: "#4578954", prdtname: "Alarm Clock", src: "../../../assets/images/ecommerce/png/32.png", category: "Home Decor", discount: "20", price: "$359.99", status: "Published", date: "26-01-2024", color: "success" },
  { id: 5, product: "#8745814", prdtname: "Running Shoes", src: "../../../assets/images/ecommerce/png/28.png", category: "Athletic Footwear", discount: "0", price: "$568.87", status: "Published", date: "24-03-2024", color: "success" },
]

export const Payment = [
  { id: 1, icon: "ri-bank-card-line", title: ' Credit Card', percent: '25%', color: 'primary3' },
  { id: 2, icon: "ri-paypal-line", title: 'PayPal', percent: '20%', color: 'primary2' },
  { id: 3, icon: "ri-visa-line", title: 'VISA', percent: '15%', color: 'primary1' },
  { id: 4, icon: "ri-apple-line", title: 'Apple Pay', percent: '10%', color: 'info' },
  { id: 5, icon: "ri-google-line", title: 'Google Pay', percent: '10%', color: 'secondary' },
]


export const Recentactivity = [
  {
    Id: 1,
    IconSize: "avatar-sm",
    Iconclass: "bg-primary",
    Icon: "ri-shopping-cart-line",
    Title: "New Order - #12345",
    Desc: "2 items purchased by John Doe",
    Duration: "3 hrs ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 2,
    IconSize: "avatar-sm",
    Iconclass: "bg-success",
    Icon: "ri-checkbox-circle-line fs-14",
    Title: "Order Shipped - #12345",
    Desc: "Shipped via FedEx",
    Duration: "1 day ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 3,
    IconSize: "avatar-sm",
    Iconclass: "bg-primary1",
    Icon: "ri-add-circle-line fs-14",
    Title: "Added New Products",
    Desc: "New items added in Fashions",
    Duration: "12 days ago",
    img: [
      "../../../assets/images/ecommerce/png/7.png",
      "../../../assets/images/ecommerce/png/12.png",
  ],
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 4,
    IconSize: "avatar-sm",
    Iconclass: "bg-danger",
    Icon: "ri-heart-3-line fs-14",
    Title: "Product Favorited - iPhone 12 Pro",
    Desc: "Added to favorites by Jane Smith",
    Duration: "2 days ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 5,
    IconSize: "avatar-sm",
    Iconclass: "bg-warning",
    Icon: "ri-star-line fs-14",
    Title: "Product Rated - Samsung Galaxy S21",
    Desc: "Rated 4.5 stars by John Doe",
    Duration: "3 days ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 6,
    IconSize: "avatar-sm",
    Iconclass: "bg-info",
    Icon: "ri-price-tag-3-line fs-14",
    Title: "Product Discount - Nike Air Max",
    Desc: "Discounted price applied",
    Duration: "4 days ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
  {
    Id: 7, 
    IconSize: "avatar-sm",
    Iconclass: "bg-secondary",
    Icon: "ri-chat-1-line fs-14",
    Title: "Customer Inquiry - Order ID: #12346",
    Desc: "Inquiry received from customer",
    Duration: "5 days ago",
    DurationClass: 'd-block text-muted fs-11 op-7'
  },
];

interface TableRow {
  id: string;
  name: string;
  imageSrc: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Pending';
  color: string;
}

export const tableData: TableRow[] = [
  {
    id: "#SPK781",
    name: "Priceton Gray",
    imageSrc: "../../../assets/images/faces/15.jpg",
    date: "Mar 18, 2024",
    amount: "$2,145.90",
    status: "Paid",
    color: 'success'
  },
  {
    id: "#SPK782",
    name: "Elsa Urena",
    imageSrc: "../../../assets/images/faces/4.jpg",
    date: "Mar 20, 2024",
    amount: "$2,145.90",
    status: "Unpaid",
    color: 'danger'
  },
  {
    id: "#SPK783",
    name: "Gloria",
    imageSrc: "../../../assets/images/faces/5.jpg",
    date: "Mar 24, 2024",
    amount: "$2,145.90",
    status: "Paid",
    color: 'success'
  },
  {
    id: "#SPK784",
    name: "Priya",
    imageSrc: "../../../assets/images/faces/6.jpg",
    date: "Mar 25, 2024",
    amount: "$2,145.90",
    status: "Pending",
    color: 'warning'
  },
  {
    id: "#SPK785",
    name: "Adam Smith",
    imageSrc: "../../../assets/images/faces/11.jpg",
    date: "Mar 18, 2024",
    amount: "$2,145.90",
    status: "Unpaid",
    color: 'danger'
  },
];