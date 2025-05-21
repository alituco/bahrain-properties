
import Link from 'next/link';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { basePath } from '@/next.config';
import { Dropdown, Form, ListGroup, Modal } from 'react-bootstrap';
import { ThemeChanger, removeFromCart } from '@/shared/redux/action';
import store from '@/shared/redux/store';
import { connect, useDispatch, useSelector } from 'react-redux';
import { MENUITEMS } from '../sidebar/nav';
import SpkButton from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import SpkDropdown from '@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown';
import SpkListgroup from '@/shared/@spk-reusable-components/reusable-uielements/spk-listgroup';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  firm_id: number;
  real_estate_firm: string;
}

const Header = ({ local_varaiable, ThemeChanger }: any) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ensure cookies are sent
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/");
      }
    }
    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/");
      }
    }
    fetchUserProfile();
  }, [router]);

  //full screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.fullscreenElement &&
      !document.fullscreenElement
    ) {
      // Enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  //MenuClose

  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({ ...theme, toggled: local_varaiable.toggled ? local_varaiable.toggled : '' });
    }
  }

  //Toggle-Function

  function toggleSidebar() {
    const theme = store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, "dataNavStyle": "" });
            if (theme.toggled === "close-menu-close") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, "dataNavStyle": "" });
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, "toggled": "", "iconOverlay": '' });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({ ...theme, "toggled": "icon-overlay-close", "iconOverlay": '' });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, "dataNavStyle": "" });
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, "dataNavStyle": "" });
            ThemeChanger({ ...theme, "dataNavStyle": "" });
            if (theme.toggled === "double-menu-open") {
              ThemeChanger({ ...theme, "toggled": "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, "toggled": "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add("double-menu-active");
                }
                else {

                  ThemeChanger({ ...theme, "toggled": "double-menu-close" });
                }
              }
            }
            break;
          // detached
          case "detached":
            if (theme.toggled === "detached-close") {
              ThemeChanger({ ...theme, "toggled": "", "iconOverlay": '' });
            } else {
              ThemeChanger({ ...theme, "toggled": "detached-close", "iconOverlay": '' });
            }

            break;

          // default
          case "default":
            ThemeChanger({ ...theme, "toggled": "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            }
            else {
              ThemeChanger({ ...theme, "toggled": "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "menu-hover-closed" });

            }
            break;
          case "icon-click":
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-click-closed" });

            }
            break;
          case "icon-hover":
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, "toggled": "" });
            } else {
              ThemeChanger({ ...theme, "toggled": "icon-hover-closed" });

            }
            break;

        }
      }
    }
    else {
      if (theme.toggled === "close") {
        ThemeChanger({ ...theme, "toggled": "open" });

        setTimeout(() => {
          if (theme.toggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, "toggled": "close" });
      }
    }



  };

  //Dark Model
  const toggledark = () => {
    ThemeChanger({
      ...local_varaiable,
      "dataThemeMode": local_varaiable.dataThemeMode == 'dark' ? 'light' : 'dark',
      "dataHeaderStyles": local_varaiable.dataThemeMode == 'dark' ? 'light' : 'dark',
      "dataMenuStyles": local_varaiable.dataNavLayout == 'horizontal' ? local_varaiable.dataThemeMode == 'dark' ? 'light' : 'dark' : "dark"

    });
    const theme = store.getState();

    if (theme.dataThemeMode != 'dark') {

      ThemeChanger({
        ...theme,
        "bodyBg": '',
        "lightRgb": '',
        "bodyBg2": '',
        "inputBorder": '',
        "formControlBg": '',
        "gray": '',
      });
      localStorage.setItem("xintralighttheme", "light");
      localStorage.removeItem("xintradarktheme");
      localStorage.removeItem("xintraMenu");
      localStorage.removeItem("xintraHeader");
      localStorage.removeItem("bodyBg");
      localStorage.removeItem("bodyBg2");
      localStorage.removeItem("inputBorder");
      localStorage.removeItem("lightRgb");
      localStorage.removeItem("formControlBg");
      localStorage.removeItem("gray");
    }
    else {
      localStorage.setItem("xintradarktheme", "dark");
      localStorage.removeItem("xintralighttheme");
      localStorage.removeItem("xintraMenu");
      localStorage.removeItem("xintraHeader");
    }

  };

  //Switcher-Icon
  const Switchericon = () => {
    document.querySelector(".offcanvas-end")?.classList.toggle("show");
    if (document.querySelector(".switcher-backdrop")?.classList.contains("d-none")) {
      document.querySelector(".switcher-backdrop")?.classList.add("d-block");
      document.querySelector(".switcher-backdrop")?.classList.remove("d-none");
    }
  };


  //Search Functionality
  const searchRef = useRef(null);

  const handleClick = (event: { target: any; }) => {
    const searchInput: any = searchRef.current;

    if (searchInput && (searchInput === event.target || searchInput.contains(event.target))) {
      document.querySelector(".header-search")?.classList.add("searchdrop");
    } else {
      document.querySelector(".header-search")?.classList.remove("searchdrop");
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);
  const [showa, setShowa] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  useEffect(() => {
    const clickHandler = (_event: any) => {
      const searchResult = document.querySelector(".search-result");
      if (searchResult) {
        searchResult.classList.add("d-none");
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  const myfunction = (inputvalue: string) => {
    document.querySelector(".search-result")?.classList.remove("d-none");

    const i: any = [];
    const allElement2: any = [];
    MENUITEMS.forEach((mainLevel: any) => {
      if (mainLevel.children) {
        setShowa(true);
        mainLevel.children.forEach((subLevel: any) => {
          i.push(subLevel);
          if (subLevel.children) {
            subLevel.children.forEach((subLevel1: any) => {
              i.push(subLevel1);
              if (subLevel1.children) {
                subLevel1.children.forEach((subLevel2: any) => {
                  i.push(subLevel2);
                });
              }
            });
          }
        });
      }
    });
    for (const allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())) {
          setShow2(true);

          // Check if the element has a path and doesn't already exist in allElement2 before pushing
          if (allElement.path && !allElement2.some((el: any) => el.title === allElement.title)) {
            allElement2.push(allElement);
          }
        }
      }
    }

    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Search");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("");
        setsearchval("There is no result found.");
      }
    }
    setNavData(allElement2);

  };

  //Responsive Search
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  async function handleLogOut() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to log out");
        return;
      }
    } catch (error) {
      console.error("Error logging out:", error);
      return;
    }
    setUser(null);
    router.push("/");
  }

  return (
    <Fragment>
      <header className="app-header sticky" id="header">

        {/* <!-- Start::main-header-container --> */}
        <div className="main-header-container container-fluid">

          {/* <!-- Start::header-content-left --> */}
          <div className="header-content-left">

            {/* <!-- Start::header-element --> */}
            <div className="header-element">
              <div className="horizontal-logo">
                <Link href="/components/dashboard/sales" className="header-logo">
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-logo.png`} alt="logo" className="desktop-logo" />
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-dark.png`} alt="logo" className="toggle-dark" />
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-dark.png`} alt="logo" className="desktop-dark" />
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-logo.png`} alt="logo" className="toggle-logo" />
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-white.png`} alt="logo" className="toggle-white" />
                  <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-white.png`} alt="logo" className="desktop-white" />
                </Link>
              </div>
            </div>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}
            <div className="header-element mx-lg-0 mx-2">
              <Link aria-label="Hide Sidebar" onClick={() => toggleSidebar()} className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle" data-bs-toggle="sidebar" href="#!"><span></span></Link>
            </div>
            {/* <!-- End::header-element --> */}

            {/* <!-- Start::header-element --> */}

            <div className="header-element header-search d-md-block d-none my-auto auto-complete-search">
              {/* Start::header-link */}
              <input type="text" className="header-search-bar form-control" id="header-search" placeholder="Search for Results..." onClick={() => { }}
                autoComplete="off"
                ref={searchRef}
                defaultValue={InputValue}
                onChange={(ele => { myfunction(ele.target.value); setInputValue(ele.target.value); })} autoCapitalize="off" />
              {showa ?
                <div className="card search-result position-absolute">
                  <div className="card-header">
                    <div className="card-title mb-0 text-break">Search result of {InputValue}</div>
                  </div>
                  <div className='card-body overflow-auto'>
                    <SpkListgroup CustomClass='m-2'>
                      {show2 ?
                        NavData.map((e: any) =>
                          <ListGroup.Item key={Math.random()} className="">
                            <Link href={`${e.path}/`} className='search-result-item' onClick={() => { setShowa(false), setInputValue(""); }}>{e.title}</Link>
                          </ListGroup.Item>
                        )
                        : <b className={`${searchcolor} `}>{searchval}</b>}
                    </SpkListgroup>
                  </div>
                </div>
                : ""}
              <Link href="#!" className="header-search-icon border-0">
                <i className="ri-search-line"></i>
              </Link>
            </div>
            {/* <!-- End::header-element --> */}

          </div>

          <ul className="header-content-right">

            <li className="header-element d-md-none d-block">
              <Link href="#!" className="header-link" onClick={handleShow}>
                <i className="bi bi-search header-link-icon lh-1"></i>
              </Link>
            </li>

            <SpkDropdown Customclass="header-element country-selector" autoClose="outside" toggleas="a" Navigate='#!' Customtoggleclass='header-link dropdown-toggle no-caret' Svgicon='m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802'
              SvgClass='w-6 h-6 header-link-icon' Svg={true} Menuclass='main-header-dropdown dropdown-menu-end' Align="end">
              <li>
                <Dropdown.Item className="d-flex align-items-center" href="#!">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-rounded avatar-xs lh-1 me-2">
                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/us_flag.jpg`} alt="img" />
                      </span>
                      English
                    </div>
                  </div>
                </Dropdown.Item>
              </li>
              <li>
                <Dropdown.Item className="d-flex align-items-center" href="#!">
                  <span className="avatar avatar-rounded avatar-xs lh-1 me-2">
                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/uae_flag.jpg`} alt="img" />
                  </span>
                  عربي
                </Dropdown.Item>
              </li>
            </SpkDropdown>

            <li className="header-element header-theme-mode" >
              <Link href="#!" className="header-link layout-setting" onClick={() => toggledark()}>

                <span className="light-layout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 header-link-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                </span>

                <span className="dark-layout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 header-link-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                </span>

              </Link>
            </li>

            <li className="header-element header-fullscreen">
              <Link href="#!" className="header-link" onClick={toggleFullscreen}>
                {isFullscreen ? (

                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 full-screen-close header-link-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 full-screen-open header-link-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </Link>
            </li>


            <SpkDropdown Customclass="header-element" toggleas="a" Navigate='#!' Customtoggleclass='header-link no-caret' Id="mainHeaderProfile" Imagetag={true}
              Imageclass='d-flex align-items-center avatar avatar-sm' Imagesrc={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/15.jpg`}
              Menuclass='main-header-dropdown pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end' Menulabel='mainHeaderProfile'>
              <Dropdown.Item className="text-center border-bottom">
                <div>
                  <span>
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="d-block fs-12 text-muted">{user?.real_estate_firm}</span>
                </div>
              </Dropdown.Item>
              <li><Link className="dropdown-item d-flex align-items-center" href="/profile"><i className="fe fe-user p-1 rounded-circle bg-primary-transparent me-2 fs-16"></i>Profile</Link></li>
              <li><Link className="dropdown-item d-flex align-items-center" href="/components/pages/email/mail-settings"><i className="fe fe-settings p-1 rounded-circle bg-primary-transparent ings me-2 fs-16"></i>Settings</Link></li>
              <li><Dropdown.Item className="dropdown-item d-flex align-items-center" onClick={handleLogOut}><i className="fe fe-lock p-1 rounded-circle bg-primary-transparent ut me-2 fs-16"></i>Log Out</Dropdown.Item></li>
            </SpkDropdown>

            <li className="header-element" >
             <Link href="#!" className="header-link switcher-icon" data-bs-toggle="offcanvas" data-bs-target="#switcher-canvas" onClick={() => Switchericon()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 header-link-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
            </li>

          </ul>
          {/* <!-- End::header-content-right --> */}

        </div>
        {/* <!-- End::main-header-container --> */}

      </header>
      <Modal show={show} onHide={handleClose} className="fade" id="header-responsive-search" tabIndex={-1} aria-labelledby="header-responsive-search">
        <div className="modal-content">
          <Modal.Body>
            <div className="input-group">
              <Form.Control type="text" className="border-end-0" placeholder="Search Anything ..."
                aria-label="Search Anything ..." aria-describedby="button-addon2" />
              <SpkButton Buttonvariant='primary' Buttontype="button"
                Id="button-addon2"><i className="bi bi-search"></i></SpkButton>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </Fragment>
  )
}

const mapStateToProps = (state: any) => ({
  local_varaiable: state
});
export default connect(mapStateToProps, { ThemeChanger })(Header);