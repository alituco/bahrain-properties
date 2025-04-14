
//audience
export const Audseries = [{
    name: "Followers",
    data: [30, 58, 25, 42, 35, 33, 63, 25, 53, 57, 38, 40],
    type: 'column',
},
{
    name: "Total Views",
    data: [20, 38, 38, 72, 55, 73, 43, 55, 33, 45, 30, 60],
    type: 'line',
}]
export const Audoptions: any = {
    chart: {
        type: 'line',
        height: 330,
        toolbar: {
            show: false,
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            opacity: 0.05,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '20%',
            borderRadius: 6
        },
    },
    grid: {
        borderColor: 'rgba(167, 180, 201 ,0.2)',
    },
    colors: ['var(--primary-color)', "rgb(227, 84, 212)"],
    stroke: {
        width: [0, 2],
        curve: ["smooth", "straight"],
        dashArray: [0, 4],
    },
    dataLabels: {
        enabled: false,
    }, fill: {
        opacity: 1
    },
    legend: {
        show: true,
        position: 'top',
        labels: {
            colors: '#74767c',
        },
    },
    yaxis: {
        // labels: {
        //     formatter: function (y: number) {
        //         return y.toFixed(0) + "";
        //     }
        // },
        labels: {
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    xaxis: {
        // type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
        axisBorder: {
            show: true,
            color: 'rgba(167, 180, 201 ,0.2)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(167, 180, 201 ,0.2)',
            // width: 6,
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
    }
}

//follow-on-device
export const Deviceseries = [1754, 1234, 878]
export const Deviceoptions: any = {
    chart: {
        height: 197,
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
        color: ["#fff"],
        width: 0,
        dashArray: 0,
    },
    labels: ["Mobile", "Tablet", "Desktop"],
    colors: ["var(--primary-color)", "rgb(227, 84, 212)", "rgba(14, 165, 232, 1)"],
    plotOptions: {
        pie: {
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
    }
}

interface Social {
    id: number;
    apps: string;
    data: string;
    followers: string;
    percent: string;
    icon: string;
    color: string;
    color1: string;
    class: string;
}
export const Socialcards: Social[] = [
    { id: 1, apps: "Instagram", data: "457K", followers: "Followers", percent: "1.5", icon: "down", color: "danger", color1: "primary2", class: "insta" },
    { id: 2, apps: "Linked In", data: "457K", followers: "Followers", percent: "1.5", icon: "down", color: "danger", color1: "info", class: "linkedin" },
    { id: 3, apps: "Facebook", data: "2.1K", followers: "1 hr ago", percent: "1.9", icon: "down", color: "danger", color1: "primary", class: "fb" },
    { id: 4, apps: "Twitter", data: "2.1K", followers: "1 week ago", percent: "1.9", icon: "up", color: "success", color1: "dark", class: "twit" },
    { id: 5, apps: "Youtube", data: "1.1M", followers: "1 day ago", percent: "1.9", icon: "up", color: "success", color1: "danger", class: "youtube" },
    { id: 6, apps: "Messenger", data: "1.1M", followers: "1 day ago", percent: "1.9", icon: "up", color: "success", color1: "secondary", class: "msgr" },
]

interface Suggestions {
    id: number;
    src: string;
    data: string;
    data1: string;
}
export const Suggestiondata: Suggestions[] = [
    { id: 1, src: "../../../assets/images/faces/2.jpg", data: "Socrates Itumay", data1: "3 Mutual Friends" },
    { id: 2, src: "../../../assets/images/faces/3.jpg", data: "Ryan Gercia", data1: "3 Mutual Friends" },
    { id: 3, src: "../../../assets/images/faces/10.jpg", data: "Prax Bhav", data1: "3 Mutual Friends" },
    { id: 4, src: "../../../assets/images/faces/12.jpg", data: "Jackie Chen", data1: "3 Mutual Friends" },
    { id: 5, src: "../../../assets/images/faces/5.jpg", data: "Samantha Sam", data1: "3 Mutual Friends" },
    { id: 6, src: "../../../assets/images/faces/15.jpg", data: "Robert Lewis", data1: "3 Mutual Friends" },
]

export const Performancedata = [
    { id: 1, date: "2024-02-15", icon: "youtube-fill", color: "danger", platform: "Youtube", likes: "150", comments: "25", shares: "50", impressions: "10,000", engaged: "3.5", followers: "458", following: "256", color1: "primary" },
    { id: 2, date: "2024-02-14", icon: "twitter-x-fill", color: "dark", platform: "Twitter", likes: "200", comments: "30", shares: "70", impressions: "15,000", engaged: "4.2", followers: "565", following: "355", color1: "secondary" },
    { id: 3, date: "2024-02-13", icon: "messenger-fill", color: "info", platform: "Facebook", likes: "300", comments: "40", shares: "90", impressions: "20,000", engaged: "5.0", followers: "458", following: "956", color1: "warning" },
    { id: 4, date: "2024-02-12", icon: "instagram-fill ", color: "secondary", platform: "Instagram", likes: "100", comments: "20", shares: "30", impressions: "8,000", engaged: "2.1", followers: "458", following: "256", color1: "orange" },
    { id: 4, date: "2024-02-11", icon: "twitter-x-fill", color: "dark", platform: "Twitter", likes: "120", comments: "15", shares: "40", impressions: "12,000", engaged: "3.0", followers: "856", following: "295", color1: "info" },
]