
import { MENUITEMS } from "@/shared/layouts-components/sidebar/nav";
import store from "@/shared/redux/store";
import { ClassAttributes, InputHTMLAttributes, JSX, useState } from "react";

export function Dark(actionfunction: any, clicked?: any) {
    const theme: any = store.getState()
    actionfunction({
        ...theme,
        "dataThemeMode": "dark",
        "dataHeaderStyles": "dark",
        "dataMenuStyles": "dark",
        "bodyBg": "",
        "bgImg": "",
        "bodyBg2": "",
        "inputBorder": "",
        "lightRgb": "",
        "gray": ""

    })
    localStorage.setItem("xintradarktheme", "dark");
    localStorage.setItem("xintraMenu", "dark");
    localStorage.removeItem("xintralighttheme");
    if (clicked) {
        localStorage.removeItem("bodyBg");
        localStorage.removeItem("bodyBg2");
        localStorage.removeItem("bgImg");
        localStorage.removeItem("xintraHeader");
    }

}
export function Light(actionfunction: any, clicked?: any) {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataThemeMode": "light",
        "dataHeaderStyles": "light",
        "bodyBg": "",
        "bgImg": "",
        "bodyBg2": "",
        "inputBorder": "",
        "lightRgb": "",
        "formControlBg": "",
        "dataMenuStyles": "dark",
        "gray": ""

    })
    localStorage.setItem("xintralighttheme", "light");
    localStorage.removeItem("xintradarktheme");
    if (clicked) {
        localStorage.removeItem("bodyBg");
        localStorage.removeItem("bodyBg2");
        localStorage.removeItem("inputBorder");
        localStorage.removeItem("lightRgb");
        localStorage.removeItem("formControlBg");
        localStorage.removeItem("gray");
        localStorage.removeItem("xintraMenu");
        localStorage.removeItem("xintraHeader");
    }

}

export function Ltr(actionfunction: any) {
    const theme = store.getState()
    actionfunction({
        ...theme, "dir": "ltr",

    })
    localStorage.removeItem("xintrartl");
};
export function Rtl(actionfunction: any) {
    const theme = store.getState()
    actionfunction({
        ...theme, "dir": "rtl",

    })
    localStorage.setItem("xintrartl", "rtl");
};
export const Vertical = (actionfunction: any) => {
    const theme = store.getState()

    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        // "dataMenuStyles": 'dark',
        "dataVerticalStyle": "overlay",
        "toggled": "",
        "dataNavStyle": '',
    })

    localStorage.setItem("xintralayout", "vertical");
    localStorage.removeItem("xintranavstyles");

    const Sidebar: any = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }

};

export const HorizontalClick = (actionfunction: any) => {
    const theme = store.getState()
    setTimeout(() => {
        document.querySelector<HTMLElement>(".main-content")?.click();
    }, 100);
    actionfunction({
        ...theme,
        "dataNavLayout": "horizontal",
        "dataVerticalStyle": "",
        "dataNavStyle": localStorage.xintranavstyles ? localStorage.xintranavstyles : "menu-click",

    })
    localStorage.setItem("xintralayout", "horizontal");
    localStorage.removeItem("xintraverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
    closeMenu()
};
export const Menuclick = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavStyle": "menu-click",
        "toggled": "menu-click-closed",
        "dataVerticalStyle": "",

    })
    localStorage.setItem("xintranavstyles", "menu-click");

};
export const MenuHover = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavStyle": "menu-hover",
        "dataVerticalStyle": "",
        "toggled": "menu-hover-closed",
        "horStyle": "",

    })
    localStorage.setItem("xintranavstyles", "menu-hover");
    // localStorage.removeItem("xintraverticalstyles");
    // closeMenu();
};

export const IconClick = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataVerticalStyle": "",
        "dataNavStyle": "icon-click",
        "toggled": "icon-click-closed",

    })
    localStorage.setItem("xintranavstyles", "icon-click");
    // localStorage.removeItem("xintraverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};
function closeMenu() {
    const closeMenudata = (items: any) => {
        items?.forEach((item: any) => {
            item.active = false;
            closeMenudata(item.children);
        });
    };
    closeMenudata(MENUITEMS);
}


export const IconHover = (actionfunction: any) => {

    const theme = store.getState();
    actionfunction({
        ...theme,
        "dataNavStyle": "icon-hover",
        "toggled": "icon-hover-closed",
        "dataVerticalStyle": "",

    })
    localStorage.setItem("xintranavstyles", "icon-hover");
    localStorage.removeItem("xintraverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
    closeMenu()
};

export const Regular = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "regular",

    });
    localStorage.setItem("xintraregular", "Regular");
    localStorage.removeItem("xintraclassic");
    localStorage.removeItem("xintramodern");
};
export const Classic = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "classic",

    });
    localStorage.setItem("xintraclassic", "Classic");
    localStorage.removeItem("xintraregular");
    localStorage.removeItem("xintramodern");
};
export const Modern = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "dataPageStyle": "modern",

    });
    localStorage.setItem("xintramodern", "Modern");
    localStorage.removeItem("xintraregular");
    localStorage.removeItem("xintraclassic");
};
export function Enable(actionfunction: any) {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "loader": "enable",

    });
    localStorage.setItem("xintraloaderenable", "enable");
    localStorage.removeItem("xintraloaderdisable");
}
export function Disable(actionfunction: any) {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "loader": "disable",

    });
    localStorage.setItem("xintraloaderdisable", "disable");
    localStorage.removeItem("xintraloaderenable");
}

export const Fullwidth = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataWidth": "fullwidth",

    })
    localStorage.setItem("xintrafullwidth", "Fullwidth");
    localStorage.removeItem("xintraboxed");

};
export const Boxed = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataWidth": "boxed",

    })
    localStorage.setItem("xintraboxed", "Boxed");
    localStorage.removeItem("xintrafullwidth");
};
export const FixedMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuPosition": "fixed",

    })
    localStorage.setItem("xintramenufixed", "MenuFixed");
    localStorage.removeItem("xintramenuscrollable");
};
export const scrollMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuPosition": "scrollable",

    })
    localStorage.setItem("xintramenuscrollable", "Menuscrolled");
    localStorage.removeItem("xintramenufixed")

};
export const Headerpostionfixed = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderPosition": "fixed",

    })
    localStorage.setItem("xintraheaderfixed", 'FixedHeader');
    localStorage.removeItem("xintraheaderscrollable");
};
export const Headerpostionscroll = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderPosition": "scrollable",

    })
    localStorage.setItem("xintraheaderscrollable", "ScrollableHeader");
    localStorage.removeItem("xintraheaderfixed");
};

export const Defaultmenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataVerticalStyle": "overlay",
        "dataNavLayout": "vertical",
        "toggled": "",
        "dataNavStyle": "",
    })
    localStorage.setItem("xintraverticalstyles", "default");
    localStorage.removeItem("xintraverticalstyles");

};

export const Closedmenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "closed",
        "toggled": "close-menu-close",

    })
    localStorage.setItem("xintraverticalstyles", "closed");

};
function icontextOpenFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.setAttribute('data-icon-text', 'open');
    }
}
function icontextCloseFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.removeAttribute('data-icon-text');
    }
}
export const iconText = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "icontext",
        "toggled": "icon-text-close",
        "dataNavStyle": "",

    })
    localStorage.setItem("xintraverticalstyles", "icontext");
    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        icontextOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        icontextCloseFn();
    });
};

export const iconOverayFn = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "icon-overlay-close",

    })
    localStorage.setItem("xintraverticalstyles", "overlay");

    // const icon: any = document.getElementById("switcher-icon-overlay");
    // if (icon) {
    // 	icon.checked = true;
    // }
    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');
    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn();
    });
};
function DetachedOpenFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.setAttribute('data-icon-overlay', "open");
        }
    }
}
function DetachedCloseFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.removeAttribute('data-icon-overlay');
        }
    }
}
export const DetachedFn = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "detached",
        "toggled": "detached-close",
        "dataNavStyle": "",

    })
    localStorage.setItem("xintraverticalstyles", "detached");
    localStorage.removeItem("xintranavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {

        DetachedCloseFn();
    });
};
function closeMenu1() {
    const closeMenudata = (items: any) => {
        items?.forEach((item: any) => {
            item.active = true;
            closeMenudata(item.children);
        });
    };
    closeMenudata(MENUITEMS);
}
export const DoubletFn = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "doublemenu",
        "toggled": "double-menu-open",
        "dataNavStyle": "",

    })
    localStorage.setItem("xintraverticalstyles", "doublemenu");
    localStorage.removeItem("xintranavstyles");

    setTimeout(() => {
        if (!document.querySelector(".main-menu .slide.active ul")) {
            const theme = store.getState();
            actionfunction(
                {
                    ...theme,
                    "toggled": "double-menu-close",


                }
            );
        }
    }, 100);
    // closeMenu1()
}
// export const DoubletFn = (actionfunction: any) => {

//     const theme = store.getState();
//     actionfunction({
//         ...theme,
//         "dataNavLayout": "vertical",
//         "dataVerticalStyle": "doublemenu",
//         "toggled": "double-menu-open",
//         "dataNavStyle": "",
//     });
//     localStorage.setItem("xintraverticalstyles", "doublemenu");
//     localStorage.removeItem("xintranavstyles");

//     setTimeout(() => {
//         if (!document.querySelector(".main-menu .has-sub.open")) {
//             const theme = store.getState();
//             actionfunction(
//                 {
//                     ...theme,
//                     "toggled": "double-menu-close"
//                 }
//             );
//         }
//     }, 100);
// };

export const colorMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuStyles": "color",

    })
    localStorage.setItem("xintraMenu", "color");
    localStorage.removeItem("gradient");

};

export const lightMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuStyles": "light",

    })
    localStorage.setItem("xintraMenu", "light");
    localStorage.removeItem("dark");
};

export const darkMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuStyles": "dark",

    })
    localStorage.setItem("xintraMenu", "dark");
    localStorage.removeItem("light");
};

export const gradientMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuStyles": "gradient",

    })
    localStorage.setItem("xintraMenu", "gradient");
    localStorage.removeItem("color");
};
export const transparentMenu = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataMenuStyles": "transparent",

    })
    localStorage.setItem("xintraMenu", "transparent");
    localStorage.removeItem("gradient");
};

export const lightitle = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderStyles": "light",

    })
    localStorage.setItem("xintraHeader", "light");
    localStorage.removeItem("dark");
};
export const darkHeader = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderStyles": "dark",

    })
    localStorage.setItem("xintraHeader", "dark");
    localStorage.removeItem("light");
};
export const colorHeader = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderStyles": "color",

    })
    localStorage.removeItem("dark");
    localStorage.setItem("xintraHeader", "color");
};
export const gradientitle = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderStyles": "gradient",

    })
    localStorage.removeItem("transparent");
    localStorage.setItem("xintraHeader", "gradient");
};
export const transparentitle = (actionfunction: any) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "dataHeaderStyles": "transparent",

    })
    localStorage.removeItem("gradient");
    localStorage.setItem("xintraHeader", "transparent");
};

export const primaryColor1 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "118, 71, 229",

    });
    localStorage.setItem("primaryRGB", "118, 71, 229");
};
export const primaryColor2 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "63, 75, 236",

    });
    localStorage.setItem("primaryRGB", "63, 75, 236");
    // localStorage.setItem("primaryRGB1", "92 144 163");
};
export const primaryColor3 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "55, 125, 206",
        "colorPrimary": "161 90 223",

    });
    localStorage.setItem("primaryRGB", "55, 125, 206");
    // localStorage.setItem("primaryRGB1", "161 90 223");
};
export const primaryColor4 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "1, 159, 162",
        "colorPrimary": "78 172 76",

    });
    localStorage.setItem("primaryRGB", "1, 159, 162");
    // localStorage.setItem("primaryRGB1", "78 172 76");
};
export const primaryColor5 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "colorPrimaryRgb": "139, 149, 4",
        // "colorPrimary": "223 90 90",

    });
    localStorage.setItem("primaryRGB", "139, 149, 4");
    // localStorage.setItem("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "bodyBg": "12, 23, 91",
        "bodyBg2": "17, 31, 96",
        "inputBorder": "rgba(255,255,255,0.1)",
        "lightRgb": "17, 31, 96",
        "formControlBg": "rgb(17, 31, 96)",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark",
        "gray": "rgb(17, 31, 96)"
    });
    localStorage.setItem('bodyBg', "12 23 91");
    localStorage.setItem('bodyBg2', "17, 31, 96");
    localStorage.setItem('lightRgb', "17, 31, 96");
    localStorage.setItem('formControlBg', "rgb(17, 31, 96)");
    localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)");
    localStorage.setItem('gray', "rgb(17, 31, 96)");
    localStorage.setItem('xintraMenu', "dark");
    localStorage.setItem('xintraHeader', "dark");
    // localStorage.setItem('xintradarktheme', "dark");


};
export const backgroundColor2 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "bodyBg": "50, 11, 110",
        "bodyBg2": "57, 16, 120",
        "inputBorder": "rgba(255,255,255,0.1)",
        "lightRgb": "57, 16, 120",
        "formControlBg": "rgb(57, 16, 120)",
        "gray": "rgb(57, 16, 120)",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark",

    });
    localStorage.setItem('bodyBg', "50, 11, 110");
    localStorage.setItem('bodyBg2', "57, 16, 120");
    localStorage.setItem('lightRgb', "57, 16, 120");
    localStorage.setItem('formControlBg', "rgb(57, 16, 120)");
    localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)");
    localStorage.setItem('gray', "rgb(57, 16, 120)");
    localStorage.setItem('xintraMenu', "dark");
    localStorage.setItem('xintraHeader', "dark");
    // localStorage.setItem('xintradarktheme', "dark");
};
export const backgroundColor3 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "bodyBg": "8, 81, 113",
        "bodyBg2": "27, 101, 133",
        "inputBorder": "rgba(255,255,255,0.1)",
        "lightRgb": "27, 101, 133",
        "formControlBg": "rgb(27, 101, 133)",
        "gray": "rgb(27, 101, 133)",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark",

    });
    localStorage.setItem('bodyBg', "8, 81, 113");
    localStorage.setItem('bodyBg2', "27, 101, 133");
    localStorage.setItem('lightRgb', "27, 101, 133");
    localStorage.setItem('formControlBg', "rgb(27, 101, 133)");
    localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)");
    localStorage.setItem('gray', "rgb(27, 101, 133)");
    localStorage.setItem('xintraMenu', "dark");
    localStorage.setItem('xintraHeader', "dark");
    // localStorage.setItem('xintradarktheme', "dark");
};
export const backgroundColor4 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "bodyBg": "3, 81, 60",
        "bodyBg2": "8, 99, 75",
        "inputBorder": "rgba(255,255,255,0.1)",
        "lightRgb": "8, 99, 75",
        "formControlBg": "rgb(8, 99, 75)",
        "gray": "rgb(8, 99, 75)",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark",

    });
    localStorage.setItem('bodyBg', "3, 81, 60");
    localStorage.setItem('bodyBg2', "8, 99, 75");
    localStorage.setItem('lightRgb', "8, 99, 75");
    localStorage.setItem('formControlBg', "rgb(8, 99, 75)");
    localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)");
    localStorage.setItem('gray', "rgb(8, 99, 75)");
    localStorage.setItem('xintraMenu', "dark");
    localStorage.setItem('xintraHeader', "dark");
    // localStorage.setItem('xintradarktheme', "dark");
};
export const backgroundColor5 = (actionfunction: any) => {
    const theme = store.getState();
    actionfunction({
        ...theme,
        "bodyBg": "73, 78, 1",
        "bodyBg2": "84, 89, 4",
        "inputBorder": "rgba(255,255,255,0.1)",
        "lightRgb": "84, 89, 4",
        "formControlBg": "rgb(84, 89, 4)",
        "gray": "rgb(84, 89, 4)",
        "dataThemeMode": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark",

    });
    localStorage.setItem('bodyBg', "73, 78, 1");
    localStorage.setItem('bodyBg2', "84, 89, 4");
    localStorage.setItem('lightRgb', "84, 89, 4");
    localStorage.setItem('formControlBg', "rgb(84, 89, 4)");
    localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)");
    localStorage.setItem('gray', "rgb(84, 89, 4)");
    localStorage.setItem('xintraMenu', "dark");
    localStorage.setItem('xintraHeader', "dark");
    // localStorage.setItem('xintradarktheme', "dark");
};

const ColorPicker = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="color-picker-input">
            <input type="color" {...props} />
        </div>
    );
};

function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
//themeprimarycolor
const Themeprimarycolor = ({ actionfunction }: any) => {


    const theme = store.getState();
    const [state, updateState] = useState("#FFFFFF");
    const handleInput = (e: any) => {
        let { r, g, b }: any = hexToRgb(e.target.value);
        updateState(e.target.value);
        actionfunction({
            ...theme,
            "colorPrimaryRgb": `${r} ${g} ${b}`,
            "colorPrimary": `${r} ${g} ${b}`
        });
        localStorage.setItem("dynamiccolor", `${r} ${g} ${b}`);
    };
    return (
        <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export default Themeprimarycolor;



//themeBackground
export const Themebackgroundcolor = ({ actionfunction }: any) => {


    const theme = store.getState();
    const [state, updateState] = useState("#FFFFFF");
    const handleInput = (e: any) => {
        let { r, g, b }: any = hexToRgb(e.target.value);
        updateState(e.target.value);
        actionfunction({
            ...theme,
            "bodyBg": `${r + 14} ${g + 14} ${b + 14}`,
            "bodyBg2": `${r} ${g} ${b}`,
            "inputBorder": "rgba(255,255,255,0.1)",
            "lightRgb": `${r + 5} ${g + 5} ${b + 5}`,
            "formControlBg": `rgb(${r} ${g} ${b})`,
            "dataThemeMode": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark",
        });
        localStorage.setItem("bodyBg", `${r + 14} ${g + 14} ${b + 14}`);
        localStorage.setItem('bodyBg2', `${r} ${g} ${b}`);
        localStorage.setItem('lightRgb', `${r + 5} ${g + 5} ${b + 5}`);
        localStorage.setItem('inputBorder', "rgba(255,255,255,0.1)",);
        localStorage.setItem('gray', `${r + 5} ${g + 5} ${b + 5}`);
        localStorage.setItem('formControlBg', `rgb(${r} ${g} ${b})`,);
        localStorage.setItem('xintraMenu', "dark");
        localStorage.setItem('xintraHeader', "dark");

    };

    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export const bgImage = (actionfunction: any, img:string | null) => {
    const theme = store.getState()
    actionfunction({
        ...theme,
        "bgImg": img,

    })
    localStorage.setItem("bgImg", img ?? '');
};
export const Reset = (actionfunction: any) => {
    const theme = store.getState()
    Vertical(actionfunction)
    actionfunction({
        ...theme,
        lang: "en",
        dir: "ltr",
        dataThemeMode: "light",
        dataMenuStyles: "dark",
        dataNavLayout: "vertical",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        toggled: "",
        dataNavStyle: "",
        horStyle: "",
        dataPageStyle: "regular",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "",
        bodyBg: "",
        bodyBg2: "",
        inputBorder: "",
        lightRgb: "",
        formControlBg: "",
        gray: "",
        bgImg: "",
        loader: "disable",
        iconText: "",
        body: {
            class: ""
        }
    })
    localStorage.clear();
    var icon = document.getElementById("switcher-default-menu") as HTMLInputElement;
    if (icon) {
        icon.checked = true
    }
}
export const Reset1 = (actionfunction: any) => {
    const theme = store.getState()
    Vertical(actionfunction)
    actionfunction({
        ...theme,
        lang: "en",
        dir: "ltr",
        dataThemeMode: "light",
        dataNavLayout: "horizontal",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        toggled: "",
        colorPrimaryRgb: "",
        body: {
            class: ""
        }
    })
    localStorage.clear();
    var icon = document.getElementById("switcher-default-menu") as HTMLInputElement;
    if (icon) {
        icon.checked = true
    }
}

export const LocalStorageBackup = (actionfunction: any) => {

    (localStorage.xintradarktheme) ? Dark(actionfunction) : "";
    (localStorage.xintralighttheme) ? Light(actionfunction) : "";
    (localStorage.xintrartl) ? Rtl(actionfunction) : "";
    (localStorage.xintraregular) ? Regular(actionfunction) : "";
    (localStorage.xintraclassic) ? Classic(actionfunction) : "";
    (localStorage.xintramodern) ? Modern(actionfunction) : "";
    (localStorage.xintraloaderenable) ? Enable(actionfunction) : "";
    (localStorage.xintraloaderdisable) ? Disable(actionfunction) : "";
    (localStorage.xintrafullwidth) ? Fullwidth(actionfunction) : "";
    (localStorage.xintraboxed) ? Boxed(actionfunction) : "";
    (localStorage.xintramenufixed) ? FixedMenu(actionfunction) : "";
    (localStorage.xintramenuscrollable) ? scrollMenu(actionfunction) : "";
    (localStorage.xintraheaderfixed) ? Headerpostionfixed(actionfunction) : "";
    (localStorage.xintraheaderscrollable) ? Headerpostionscroll(actionfunction) : "";
    (localStorage.bgImg) ? bgImage(actionfunction, localStorage.bgImg) : '';

    (localStorage.xintranavstyles === "menu-click") ? Menuclick(actionfunction) : '';
    (localStorage.xintranavstyles === "menu-hover") ? MenuHover(actionfunction) : '';
    (localStorage.xintranavstyles === "icon-click") ? IconClick(actionfunction) : '';
    (localStorage.xintranavstyles === "icon-hover") ? IconHover(actionfunction) : '';


    (localStorage.xintralayout == 'horizontal') && HorizontalClick(actionfunction);

    // // ThemeColor MenuColor Start
    switch (localStorage.xintraMenu) {
        case 'light':
            lightMenu(actionfunction);
            break;
        case 'dark':
            darkMenu(actionfunction);

            break;
        case 'color':
            colorMenu(actionfunction);

            break;
        case 'gradient':
            gradientMenu(actionfunction);

            break;
        case 'transparent':
            transparentMenu(actionfunction);

            break;
        default:
            break;
    }

    // ThemeColor MenuColor End

    // ThemeColor Header Colors: start
    switch (localStorage.xintraHeader) {
        case 'light':
            lightitle(actionfunction);

            break;
        case 'dark':
            darkHeader(actionfunction);

            break;
        case 'color':
            colorHeader(actionfunction);

            break;
        case 'gradient':
            gradientitle(actionfunction);

            break;
        case 'transparent':
            transparentitle(actionfunction);

            break;
        default:
            break;
    }
    // ThemeColor Header Colors: End

    // Theme Primary: Colors: Start
    switch (localStorage.primaryRGB) {
        case '118, 71, 229':
            primaryColor1(actionfunction);

            break;
        case '63, 75, 236':
            primaryColor2(actionfunction);

            break;
        case '55, 125, 206':
            primaryColor3(actionfunction);

            break;
        case '1, 159, 162':
            primaryColor4(actionfunction);

            break;
        case '139, 149, 4':
            primaryColor5(actionfunction);

            break;
        default:
            break;
    }
    // Theme Primary: Colors: End
    switch (localStorage.bodyBg) {
        case '12 23 91':
            backgroundColor1(actionfunction);

            break;
        case '50 11 110':
            backgroundColor2(actionfunction);

            break;
        case '8 81 113':
            backgroundColor3(actionfunction);

            break;
        case '3 81 60':
            backgroundColor4(actionfunction);

            break;
        case '73 78 1':
            backgroundColor5(actionfunction);

            break;
        default:
            break;
    }

    if (localStorage.xintraverticalstyles) {
        let verticalStyles = localStorage.getItem("xintraverticalstyles");

        switch (verticalStyles) {
            case "default":
                let defaultid = document.getElementById("switcher-default-menu") as HTMLInputElement;
                if (defaultid) {
                    defaultid.checked = true;
                }
                Defaultmenu(actionfunction)

                break;

            case "closed":
                let closedid = document.getElementById("switcher-icontext-menu") as HTMLInputElement;
                if (closedid) {
                    closedid.checked = true;
                }
                Closedmenu(actionfunction)

                break;
            case "icontext":
                let icontextid = document.getElementById("switcher-icontext-menu") as HTMLInputElement;
                if (icontextid) {
                    icontextid.checked = true;
                }
                iconText(actionfunction)


                break;
            case "overlay":
                let overlayid = document.getElementById("switcher-detached") as HTMLInputElement;
                if (overlayid) {
                    overlayid.checked = true;
                }
                iconOverayFn(actionfunction)

                break;
            case "detached":
                let detachedid = document.getElementById("switcher-detached") as HTMLInputElement;
                if (detachedid) {
                    detachedid.checked = true;
                }
                DetachedFn(actionfunction)

                break;
            case "doublemenu":
                let doubleMenuid = document.getElementById("switcher-double-menu") as HTMLInputElement;
                if (doubleMenuid) {
                    doubleMenuid.checked = true;
                }
                DoubletFn(actionfunction)

                break;

            default:
                let defaultbutton = document.getElementById("switcher-default-menu") as HTMLInputElement;
                if (defaultbutton) {
                    defaultbutton.checked = true;
                }
                break;
        }
    }

    //Theme Primary:
    if (localStorage.dynamiccolor) {
        const theme = store.getState()
        actionfunction({
            ...theme,
            "colorPrimaryRgb": localStorage.dynamiccolor,
            "colorPrimary": localStorage.dynamiccolor,

        })
    }
    //Theme BAckground:
    if (localStorage.bodyBg) {
        let updateddarkBg = `${Number(localStorage.bodyBg.split("")[0]) + 14} ${Number(localStorage.bodyBg.split("")[1]) + 14} ${Number(localStorage.bodyBg.split("")[2]) + 14}`
        const theme = store.getState()
        actionfunction({
            ...theme,
            "bodyBg": localStorage.bodyBg,
            "bodyBg2": localStorage.bodyBg2,
            "dataThemeMode": "dark",
            "dataHeaderStyles": "dark",
            "lightRgb": localStorage.lightRgb,
            "inputBorder": localStorage.inputBorder,
            "gray": localStorage.gray,

        })
    }
    switch (localStorage.xintraMenu) {
        case 'light':
            lightMenu(actionfunction);
            break;
        case 'dark':
            darkMenu(actionfunction);

            break;
        case 'color':
            colorMenu(actionfunction);

            break;
        case 'gradient':
            gradientMenu(actionfunction);

            break;
        case 'transparent':
            transparentMenu(actionfunction);

            break;
        default:
            break;
    }
    // ThemeColor Header Colors: start
    switch (localStorage.xintraHeader) {
        case 'light':
            lightitle(actionfunction);

            break;
        case 'dark':
            darkHeader(actionfunction);

            break;
        case 'color':
            colorHeader(actionfunction);

            break;
        case 'gradient':
            gradientitle(actionfunction);

            break;
        case 'transparent':
            transparentitle(actionfunction);

            break;
        default:
            break;
    }

}


