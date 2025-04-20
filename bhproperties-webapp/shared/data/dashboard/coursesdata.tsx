import { Card } from "react-bootstrap";
import Link from "next/link";

//earning
export const Earningsseries = [
  {
    name: "Last Year",
    data: [44, 55, 41, 67, 42, 22, 43, 21, 41, 56, 27, 43],
    type: "area",
  },
  {
    name: "This Year",
    data: [23, 11, 22, 35, 17, 28, 22, 37, 21, 44, 22, 30],
    type: "line",
  },
]
export const Earningsoptions: any = {
  chart: {
    height: 344,
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 1,
      left: 0,
      blur: 3,
      color: "#000",
      opacity: 0.1,
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
    width: [1.5, 2],
    curve: "straight",
    dashArray: [0, 5],
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "center",
    fontWeight: 600,
    fontSize: "11px",
    // tooltipHoverFormatter: function ({val, opts}:any) {
    //   return (
    //     val +
    //     " - " +
    //     opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
    //     ""
    //   );
    // },
    labels: {
      colors: "#74767c",
    },
    markers: {
      width: [8],
      height: [8],
      strokeWidth: 0,
      radius: 12,
      offsetX: 0,
      offsetY: 0,
    },
  },
  fill: {
    opacity: 1,
    type: ['gradient', 'soild'],
    gradient: {
      shade: 'light',
      type: "vertical",
      shadeIntensity: 0.01,
      opacityFrom: 0.02,
      opacityTo: 0.02,
    },
  },
  colors: ["var(--primary-color)", "rgba(227, 84, 212, 0.5)"],
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
    labels: {
      show: true,
      style: {
        colors: "#8c9097",
        fontSize: "11px",
        fontWeight: 600,
        cssClass: "apexcharts-xaxis-label",
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
      width: ["6"],
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

interface Course {
  id: number;
  total: string;
  price: string;
  inc: string;
  percent: string;
  svgicon: any;
  icon: string;
  color1: string;
  color: string;
}
const svg1 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path></svg>
const svg2 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M226.53,56.41l-96-32a8,8,0,0,0-5.06,0l-96,32A8,8,0,0,0,24,64v80a8,8,0,0,0,16,0V75.1L73.59,86.29a64,64,0,0,0,20.65,88.05c-18,7.06-33.56,19.83-44.94,37.29a8,8,0,1,0,13.4,8.74C77.77,197.25,101.57,184,128,184s50.23,13.25,65.3,36.37a8,8,0,0,0,13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64,64,0,0,0,20.65-88l44.12-14.7a8,8,0,0,0,0-15.18ZM176,120A48,48,0,1,1,89.35,91.55l36.12,12a8,8,0,0,0,5.06,0l36.12-12A47.89,47.89,0,0,1,176,120ZM128,87.57,57.3,64,128,40.43,198.7,64Z"></path></svg>
const svg3 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
const svg4 = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path></svg>

export const Coursedata: Course[] = [
  { id: 1, total: "Total Revenue", price: "$25,378", inc: "Increased", percent: "+5.35%", svgicon: svg1, icon: "up", color1: "success", color: "primary" },
  { id: 2, total: "Total Students", price: "78,565", inc: "Increased", percent: "+12.1%", svgicon: svg2, icon: "up", color1: "success", color: "primary1" },
  { id: 3, total: "Total Instructors", price: "6,247", inc: "Decreased ", percent: "-10.21%", svgicon: svg3, icon: "down", color1: "danger", color: "primary2" },
  { id: 4, total: "Total Courses", price: "2,467", inc: "Increased", percent: "+16.1%", svgicon: svg4, icon: "up", color1: "success", color: "primary3" },
]

interface Top {
  id: number;
  icon: string;
  color: string;
  data: string;
  data1: string;
  data2: string;
  class: string;
}
export const Coursetop: Top[] = [
  { id: 1, icon: "dashboard-line", color: "primary", data: "UI / UX Design", data1: "10,000 + Courses", data2: "$199.99", class: "mb-4" },
  { id: 2, icon: "advertisement-line", color: "primary1", data: "Digital Marketing", data1: "90 + Courses", data2: "$599.99", class: "mb-4" },
  { id: 3, icon: "code-box-line", color: "primary2", data: "Web Development", data1: "250 + Courses", data2: "$299.99", class: "mb-4" },
  { id: 4, icon: "bar-chart-2-line", color: "primary3", data: "Stocks & Trading", data1: "100 + Courses", data2: "$999.99", class: "mb-4" },
  { id: 5, icon: "angularjs-line", color: "secondary", data: "Angular Course", data1: "300 + Courses", data2: "$399.99", class: "mb-4" },
  { id: 6, icon: "database-2-line", color: "info", data: "Full Stack Course", data1: "500 + Courses", data2: "$199.99", class: "mb-0" },
]

interface List {
  id: number;
  src: string;
  data: string;
  data1: string;
  classes: string;
  update: string;
  instructor: string;
  student: string;
}
export const Courselist: List[] = [
  { id: 1, src: "../../../assets/images/media/media-1.jpg", data: "CSS Zero to Hero Master Class", data1: "UI/UX Designing", classes: "51", update: "22-06-2023", instructor: "Burak Oin", student: "252" },
  { id: 2, src: "../../../assets/images/media/media-4.jpg", data: "Digital Marketing Course From Scratch", data1: "Marketing", classes: "115", update: "21-06-2023", instructor: "Stuart Little", student: "1,189" },
  { id: 3, src: "../../../assets/images/media/media-10.jpg", data: "Digital Marketing Course From Scratch", data1: "Programming", classes: "30", update: "15-06-2023", instructor: "Boran Ray", student: "3,365" },
  { id: 4, src: "../../../assets/images/media/media-15.jpg", data: "Master Linear Algebra Medium Level", data1: "Mathematics", classes: "90", update: "11-06-2023", instructor: "Arya Neo", student: "773" },
  { id: 5, src: "../../../assets/images/media/media-23.jpg", data: "Learn How to Trade & Invest", data1: "Stocks & Trading", classes: "161", update: "10-06-2023", instructor: "Sia Niu", student: "51" },
]

export const Professordata = [
  { id: 1, src: "../../../assets/images/faces/2.jpg", data: "John Henry", data1: "M.Tech", data2: "321 Classes", data3: "Digital Marketing" },
  { id: 2, src: "../../../assets/images/faces/12.jpg", data: "Mortal Yun", data1: "P.H.D", data2: "25 Classes", data3: "Stocks & Trading" },
  { id: 3, src: "../../../assets/images/faces/13.jpg", data: "Trex Con", data1: "MBBS", data2: "39 Classes", data3: "Science" },
  { id: 4, src: "../../../assets/images/faces/3.jpg", data: "Saiu Sarah", data1: "P.H.D", data2: "11 Classes", data3: "Science" },
  { id: 5, src: "../../../assets/images/faces/4.jpg", data: "Ion Hau", data1: "M.Tech", data2: "124 Classes", data3: "Web Development" },
  { id: 6, src: "../../../assets/images/faces/14.jpg", data: "Roman Killon", data1: "M.Tech", data2: "1263 Classes", data3: "Ui / Ux Designing" },
  { id: 7, src: "../../../assets/images/faces/5.jpg", data: "Suzika Stallone", data1: "Phd", data2: "110 Classes", data3: "Machine Leadning" },
  { id: 8, src: "../../../assets/images/faces/15.jpg", data: "Robert Lewis", data1: "Phd", data2: "150 Classes", data3: "Java Development" },
]

const courses = [
  { imgSrc: "../../../assets/images/media/media-78.png", title: "Coding Classes", price: "$644", rating: 4.2, class: "" },
  { imgSrc: "../../../assets/images/media/media-76.png", title: "Data Science", price: "$657", rating: 4.2, class: "bg-secondary-transparent" },
  { imgSrc: "../../../assets/images/media/media-79.png", title: "Marketing", price: "$457", rating: 4.2, class: "" },
  { imgSrc: "../../../assets/images/media/media-78.png", title: "Java", price: "$778", rating: 4.2, class: "" },
  { imgSrc: "../../../assets/images/media/media-78.png", title: "Coding Classes", price: "$644", rating: 4.2, class: "" },
  { imgSrc: "../../../assets/images/media/media-76.png", title: "Data Science", price: "$657", rating: 4.2, class: "bg-primary-transparent" },
  { imgSrc: "../../../assets/images/media/media-79.png", title: "Marketing", price: "$457", rating: 4.2, class: "" },
];

export const CourseSwiper = courses.map((course, index) => (
  <div key={index}>
    <Card className="custom-card mb-0 border shadow-none">
      <Card.Body className="p-0">
        <div className="position-relative">
          <img src={course.imgSrc} alt={course.title} className={`img-fluid card-img-top ${course.class}`} />
          <div className="p-3">
            <div className="min-w-fit fs-11 text-default d-inline-flex">
              <span>
                <i className="ri-star-fill text-warning me-1"></i> {course.rating}
              </span>
            </div>
            <div className="d-flex gap-1 justify-content-between align-items-center">
              <div>
                <h6 className="fw-medium fs-14 mb-0">{course.title}</h6>
                <Link href="#!" className="text-primary fs-12">Read More</Link>
              </div>
              <h6 className="fw-semibold mb-0">{course.price}</h6>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  </div>
))

export const UpcomingTasks = [
  {
    id: 1,
    title: "Web Design",
    date: "10-06-2023",
    start: "09:00am",
    end: "12:00pm",
  },
  {
    id: 2,
    title: "Java Programming",
    date: "15-06-2023",
    start: "12:00pm",
    end: "13:20pm",
  },
  {
    id: 3,
    title: "Meeting with Yuhan Sev",
    date: "15-06-2023",
    start: "16:00pm",
    end: "17:20pm"
  },
  {
    id: 4,
    title: "UX/UI",
    date: "20-06-2023",
    start: "18:15pm",
    end: "19:00pm"
  },
  {
    id: 5,
    title: "React js",
    date: "20-06-2023",
    start: "18:15pm",
    end: "19:00pm"
  },
  {
    id: 6,
    title: "Data Structures",
    date: "25-06-2023",
    start: "10:00am",
    end: "12:30pm"
  }
];


