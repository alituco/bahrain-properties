import { ThemeChanger } from "../../redux/action"
import Themeprimarycolor, * as switcherdata from "../../data/switcherdata/switcherdata"
import React, { Fragment, useEffect } from 'react'
import { connect } from "react-redux"
import { Col, Nav, Tab } from "react-bootstrap"
import Link from "next/link"
import SpkTooltips from "../../@spk-reusable-components/reusable-uielements/spk-tooltips"
import SpkButton from "../../@spk-reusable-components/reusable-uielements/spk-button"
import { Helmet } from "react-helmet"
import { HelmetProvider } from "react-helmet-async"

const Switcher = ({ local_varaiable, ThemeChanger }:any) => {

    const Switcherclose = () => {
        if (document.querySelector(".offcanvas-end")?.classList.contains("show")) {
            document.querySelector(".offcanvas-end")?.classList.remove("show");
            document.querySelector(".switcher-backdrop")?.classList.remove("d-block");
            document.querySelector(".switcher-backdrop")?.classList.add("d-none");
        }
    };
    useEffect(() => {
        ThemeChanger({
            ...local_varaiable,
            "dir": "ltr",
            "dataNavLayout": "vertical",
            "dataMenuStyles": "dark",
            "dataHeaderStyle": "light",
            "dataToggled": ""
        })
    }, [])

    useEffect(() => {
        switcherdata.LocalStorageBackup(ThemeChanger)
    }, [])

    const customstyles:any = `
    ${local_varaiable.colorPrimaryRgb != '' ? `--primary-rgb:${local_varaiable.colorPrimaryRgb}` : ''};
    ${local_varaiable.bodyBg != '' ? `--body-bg-rgb:${local_varaiable.bodyBg}` : ''};
    ${local_varaiable.bodyBg2 != '' ? `--body-bg-rgb2:${local_varaiable.bodyBg2}` : ''};
    ${local_varaiable.lightRgb != '' ? `--light-rgb:${local_varaiable.lightRgb}` : ''};
    ${local_varaiable.formControlBg != '' ? `--form-control-bg:${local_varaiable.formControlBg}` : ''};
    ${local_varaiable.gray != '' ? `--gray-3:${local_varaiable.gray}` : ''};
    ${local_varaiable.inputBorder != '' ? `--input-border:${local_varaiable.inputBorder}` : ''};
    `;

    return (
        <Fragment>
            <HelmetProvider>
                <Helmet>
                    <html
                        dir={local_varaiable.dir}
                        data-theme-mode={local_varaiable.dataThemeMode}
                        data-header-styles={local_varaiable.dataHeaderStyles}
                        data-vertical-style={local_varaiable.dataVerticalStyle}
                        data-nav-layout={local_varaiable.dataNavLayout}
                        data-menu-styles={local_varaiable.dataMenuStyles}
                        data-toggled={local_varaiable.toggled}
                        data-nav-style={local_varaiable.dataNavStyle}
                        hor-style={local_varaiable.horStyle}
                        data-page-style={local_varaiable.dataPageStyle}
                        data-width={local_varaiable.dataWidth}
                        data-menu-position={local_varaiable.dataMenuPosition}
                        data-header-position={local_varaiable.dataHeaderPosition}
                        data-icon-overlay={local_varaiable.iconOverlay}
                        data-bg-img={local_varaiable.bgImg}
                        icon-text={local_varaiable.iconText}
                        style={customstyles}
                    >
                        
                    </html>
                </Helmet>
                <div className="switcher-backdrop d-none" onClick={() => { Switcherclose(); }}></div>
                <div className="offcanvas offcanvas-end" tabIndex={-1} id="switcher-canvas" aria-labelledby="offcanvasRightLabel">
                    <Tab.Container defaultActiveKey="home">
                        <div className="offcanvas-header border-bottom d-block p-0">
                            <div className="d-flex align-items-center justify-content-between p-3">
                                <h5 className="offcanvas-title text-default" id="offcanvasRightLabel">Switcher</h5>
                                <SpkButton Buttontype="button" Customclass="btn-close" Buttonvariant="" Buttondismiss="offcanvas" Buttonlabel="Close" onClickfunc={() => { Switcherclose(); }}></SpkButton>
                            </div>
                            <nav className="border-top border-block-start-dashed">
                                <Nav className="nav-tabs nav-justified" id="switcher-main-tab" role="tablist">
                                    <Nav.Item>
                                        <Nav.Link eventKey="home" as="button" className="" id="switcher-home-tab" data-bs-toggle="tab" data-bs-target="#switcher-home"
                                            type="button" role="tab" aria-controls="switcher-home" aria-selected="true">Theme Styles</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="profile" as="button" className="" id="switcher-profile-tab" data-bs-toggle="tab" data-bs-target="#switcher-profile"
                                            type="button" role="tab" aria-controls="switcher-profile" aria-selected="false">Theme Colors</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </nav>
                        </div>
                        <div className="offcanvas-body">
                            <Tab.Content className="" id="nav-tabContent">
                                <Tab.Pane eventKey="home" className="fade show border-0 p-0" id="switcher-home" role="tabpanel" aria-labelledby="switcher-home-tab"
                                    tabIndex={0}>
                                    <div className="">
                                        <p className="switcher-style-head">Theme Color Mode:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-light-theme">
                                                        Light
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="theme-style" id="switcher-light-theme"
                                                        checked={local_varaiable.dataThemeMode !== "dark"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Light(ThemeChanger, "clicked")} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-dark-theme">
                                                        Dark
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="theme-style" id="switcher-dark-theme" checked={local_varaiable.dataThemeMode == "dark"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Dark(ThemeChanger, "clicked")} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Directions:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-ltr">
                                                        LTR
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="direction" id="switcher-ltr" checked={local_varaiable.dir == "ltr"} onChange={(_e) => { }}
                                                        onClick={() => { switcherdata.Ltr(ThemeChanger); }} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-rtl">
                                                        RTL
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="direction" id="switcher-rtl" checked={local_varaiable.dir == "rtl"} onChange={(_e) => { }}
                                                        onClick={() => { switcherdata.Rtl(ThemeChanger); }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Navigation Styles:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-vertical">
                                                        Vertical
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-style" id="switcher-vertical"
                                                        checked={local_varaiable.dataNavLayout == "vertical"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Vertical(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-horizontal">
                                                        Horizontal
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-style"
                                                        id="switcher-horizontal" checked={local_varaiable.dataNavLayout == "horizontal"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.HorizontalClick(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="navigation-menu-styles">
                                        <p className="switcher-style-head">Vertical & Horizontal Menu Styles:</p>
                                        <div className="row switcher-style gx-0 pb-2 gy-2">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-menu-click">
                                                        Menu Click
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                        id="switcher-menu-click" checked={local_varaiable.dataNavStyle == "menu-click"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Menuclick(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-menu-hover">
                                                        Menu Hover
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                        id="switcher-menu-hover" checked={local_varaiable.dataNavStyle == "menu-hover"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.MenuHover(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-icon-click">
                                                        Icon Click
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                        id="switcher-icon-click" checked={local_varaiable.dataNavStyle == "icon-click"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.IconClick(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-icon-hover">
                                                        Icon Hover
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="navigation-menu-styles"
                                                        id="switcher-icon-hover" checked={local_varaiable.dataNavStyle == "icon-hover"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.IconHover(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sidemenu-layout-styles">
                                        <p className="switcher-style-head">Sidemenu Layout Styles:</p>
                                        <div className="row switcher-style gx-0 pb-2 gy-2">
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-default-menu">
                                                        Default Menu
                                                    </label>
                                                    {/* <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-default-menu" onChange={(_e) => { }} checked={local_varaiable.dataVerticalStyle == "overlay"} onClick={() => switcherdata.Defaultmenu(ThemeChanger)} /> */}
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        id="switcher-default-menu" defaultChecked
                                                        onClick={() => switcherdata.Defaultmenu(ThemeChanger)} />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-closed-menu">
                                                        Closed Menu
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        id="switcher-closed-menu" checked={local_varaiable.dataVerticalStyle == "closed"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Closedmenu(ThemeChanger)} />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-icontext-menu">
                                                        Icon Text
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        id="switcher-icontext-menu" checked={local_varaiable.toggled == "icon-text-close"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.iconText(ThemeChanger)} />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-icon-overlay">
                                                        Icon Overlay
                                                    </label>
                                                    {/* <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                    id="switcher-icon-overlay" 
                                                    onClick={() => switcherdata.iconOverayFn(ThemeChanger)} /> */}
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        onChange={(_e) => { }} checked={local_varaiable.toggled == "icon-overlay-close"} onClick={() => switcherdata.iconOverayFn(ThemeChanger)}
                                                        id="switcher-icon-overlay" />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-detached">
                                                        Detached
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        id="switcher-detached" checked={local_varaiable.toggled == "detached-close"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.DetachedFn(ThemeChanger)} />
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-double-menu">
                                                        Double Menu
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="sidemenu-layout-styles"
                                                        id="switcher-double-menu" checked={local_varaiable.dataVerticalStyle == "doublemenu"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.DoubletFn(ThemeChanger)} />
                                                </div>
                                            </Col>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Page Styles:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-regular">
                                                        Regular
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="page-styles" id="switcher-regular"
                                                        checked={local_varaiable.dataPageStyle == "regular"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Regular(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-classic">
                                                        Classic
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="page-styles" id="switcher-classic" checked={local_varaiable.dataPageStyle == "classic"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Classic(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-modern">
                                                        Modern
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="page-styles" id="switcher-modern" checked={local_varaiable.dataPageStyle == "modern"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Modern(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Layout Width Styles:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-full-width">
                                                        Full Width
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="layout-width" id="switcher-full-width" checked={local_varaiable.dataWidth == "fullwidth"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Fullwidth(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-boxed">
                                                        Boxed
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="layout-width" id="switcher-boxed" checked={local_varaiable.dataWidth == "boxed"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Boxed(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Menu Positions:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-menu-fixed">
                                                        Fixed
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="menu-positions" id="switcher-menu-fixed"
                                                        checked={local_varaiable.dataMenuPosition == "fixed"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.FixedMenu(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-menu-scroll">
                                                        Scrollable
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="menu-positions" id="switcher-menu-scroll" checked={local_varaiable.dataMenuPosition == "scrollable"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.scrollMenu(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="switcher-style-head">Header Positions:</p>
                                        <div className="row switcher-style gx-0">
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-header-fixed">
                                                        Fixed
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="header-positions"
                                                        id="switcher-header-fixed" checked={local_varaiable.dataHeaderPosition == "fixed"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Headerpostionfixed(ThemeChanger)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check switch-select">
                                                    <label className="form-check-label" htmlFor="switcher-header-scroll">
                                                        Scrollable
                                                    </label>
                                                    <input className="form-check-input" type="radio" name="header-positions"
                                                        id="switcher-header-scroll" checked={local_varaiable.dataHeaderPosition == "scrollable"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.Headerpostionscroll(ThemeChanger)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="profile" className="fade border-0 p-0" id="switcher-profile" role="tabpanel" aria-labelledby="switcher-profile-tab" tabIndex={0}>
                                    <div>
                                        <div className="theme-colors">
                                            <p className="switcher-style-head">Menu Colors:</p>
                                            <div className="d-flex switcher-style pb-2">
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Light Menu">
                                                        <input className="form-check-input color-input color-white" type="radio" name="menu-colors"
                                                            id="switcher-menu-light" checked={local_varaiable.dataMenuStyles == "light"} onChange={_e => { }}
                                                            onClick={() => switcherdata.lightMenu(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Dark Menu">
                                                        <input className="form-check-input color-input color-dark"
                                                            data-bs-placement="top" title="Dark Menu" type="radio" name="menu-colors"
                                                            id="switcher-menu-dark" checked={local_varaiable.dataMenuStyles == "dark"} onChange={_e => { }}
                                                            onClick={() => switcherdata.darkMenu(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Color Menu">
                                                        <input className="form-check-input color-input color-primary"
                                                            data-bs-placement="top" title="Color Menu" type="radio" name="menu-colors"
                                                            id="switcher-menu-primary" checked={local_varaiable.dataMenuStyles == "color"} onChange={_e => { }}
                                                            onClick={() => switcherdata.colorMenu(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Gradient Menu">
                                                        <input className="form-check-input color-input color-gradient"
                                                            data-bs-placement="top" title="Gradient Menu" type="radio" name="menu-colors"
                                                            id="switcher-menu-gradient" checked={local_varaiable.dataMenuStyles == "gradient"} onChange={_e => { }}
                                                            onClick={() => switcherdata.gradientMenu(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Transparent Menu">
                                                        <input className="form-check-input color-input color-transparent"
                                                            data-bs-placement="top" title="Transparent Menu"
                                                            type="radio" name="menu-colors" id="switcher-menu-transparent" checked={local_varaiable.dataMenuStyles == "transparent"} onChange={_e => { }}
                                                            onClick={() => switcherdata.transparentMenu(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                            </div>
                                            <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Menu dynamically change from below Theme Primary color picker</div>
                                        </div>
                                        <div className="theme-colors">
                                            <p className="switcher-style-head">Header Colors:</p>
                                            <div className="d-flex switcher-style pb-2">
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Light Header">
                                                        <input className="form-check-input color-input color-white"
                                                            data-bs-placement="top" title="Light Header" type="radio" name="header-colors"
                                                            id="switcher-header-light" checked={local_varaiable.dataHeaderStyles == "light"} onChange={_e => { }}
                                                            onClick={() => switcherdata.lightitle(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Dark Header">
                                                        <input className="form-check-input color-input color-dark"
                                                            data-bs-placement="top" title="Dark Header" type="radio" name="header-colors"
                                                            id="switcher-header-dark" checked={local_varaiable.dataHeaderStyles == "dark"} onChange={_e => { }}
                                                            onClick={() => switcherdata.darkHeader(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Color Header">
                                                        <input className="form-check-input color-input color-primary"
                                                            data-bs-placement="top" title="Color Header" type="radio" name="header-colors"
                                                            id="switcher-header-primary" checked={local_varaiable.dataHeaderStyles == "color"} onChange={_e => { }}
                                                            onClick={() => switcherdata.colorHeader(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Gradient Header">
                                                        <input className="form-check-input color-input color-gradient"
                                                            data-bs-placement="top" title="Gradient Header" type="radio" name="header-colors"
                                                            id="switcher-header-gradient" checked={local_varaiable.dataHeaderStyles == "gradient"} onChange={_e => { }}
                                                            onClick={() => switcherdata.gradientitle(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <SpkTooltips placement="top" title="Transparent Header">
                                                        <input className="form-check-input color-input color-transparent"
                                                            data-bs-placement="top" title="Transparent Header" type="radio" name="header-colors"
                                                            id="switcher-header-transparent" checked={local_varaiable.dataHeaderStyles == "transparent"} onChange={_e => { }}
                                                            onClick={() => switcherdata.transparentitle(ThemeChanger)} />
                                                    </SpkTooltips>
                                                </div>
                                            </div>
                                            <div className="px-4 pb-3 text-muted fs-11">Note:If you want to change color Header dynamically change from below Theme Primary color picker</div>
                                        </div>
                                        <div className="theme-colors">
                                            <p className="switcher-style-head">Theme Primary:</p>
                                            <div className="d-flex flex-wrap align-items-center switcher-style">
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-primary-1" type="radio"
                                                        name="theme-primary" id="switcher-primary" checked={local_varaiable.colorPrimaryRgb == "118, 71, 229"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.primaryColor1(ThemeChanger)} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-primary-2" type="radio"
                                                        name="theme-primary" id="switcher-primary1" checked={local_varaiable.colorPrimaryRgb == "63, 75, 236"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.primaryColor2(ThemeChanger)} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-primary-3" type="radio" name="theme-primary"
                                                        id="switcher-primary2" checked={local_varaiable.colorPrimaryRgb == "55, 125, 206"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.primaryColor3(ThemeChanger)} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-primary-4" type="radio" name="theme-primary"
                                                        id="switcher-primary3" checked={local_varaiable.colorPrimaryRgb == "1, 159, 162"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.primaryColor4(ThemeChanger)} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-primary-5" type="radio" name="theme-primary"
                                                        id="switcher-primary4" checked={local_varaiable.colorPrimaryRgb == "139, 149, 4"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.primaryColor5(ThemeChanger)} />
                                                </div>
                                                <div className="form-check switch-select ps-0 mt-1 color-primary-light">
                                                    <div className='theme-container-primary'>
                                                        <SpkButton>nano</SpkButton>
                                                    </div>
                                                    <div className='pickr-container-primary'>
                                                        <div className='pickr'>
                                                            <SpkButton Customclass='pcr-button' onClickfunc={(ele:any) => {
                                                                if (ele.target.querySelector("input")) {
                                                                    ele.target.querySelector("input").click();
                                                                }
                                                            }}>
                                                                <Themeprimarycolor theme={local_varaiable} actionfunction={ThemeChanger} />
                                                            </SpkButton>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="theme-colors">
                                            <p className="switcher-style-head">Theme Background:</p>
                                            <div className="d-flex flex-wrap align-items-center switcher-style">
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-bg-1" type="radio"
                                                        name="theme-background" id="switcher-background" checked={local_varaiable.bodyBg == "12, 23, 91"}
                                                        onClick={() => switcherdata.backgroundColor1(ThemeChanger)} onChange={(_e) => { }} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-bg-2" type="radio"
                                                        name="theme-background" id="switcher-background1" checked={local_varaiable.bodyBg == "50, 11, 110"}
                                                        onClick={() => switcherdata.backgroundColor2(ThemeChanger)} onChange={(_e) => { }} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-bg-3" type="radio" name="theme-background"
                                                        id="switcher-background2" checked={local_varaiable.bodyBg == "8, 81, 113"}
                                                        onClick={() => switcherdata.backgroundColor3(ThemeChanger)} onChange={(_e) => { }} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-bg-4" type="radio"
                                                        name="theme-background" id="switcher-background3" onClick={() => switcherdata.backgroundColor4(ThemeChanger)} onChange={(_e) => { }}
                                                        checked={local_varaiable.bodyBg == "3, 81, 60"} />
                                                </div>
                                                <div className="form-check switch-select me-3">
                                                    <input className="form-check-input color-input color-bg-5" type="radio"
                                                        name="theme-background" id="switcher-background4" onClick={() => switcherdata.backgroundColor5(ThemeChanger)} onChange={(_e) => { }}
                                                        checked={local_varaiable.bodyBg == "73, 78, 1"} />
                                                </div>
                                                <div className="form-check switch-select ps-0 mt-1 color-primary-light">
                                                    <div className='theme-container-primary'>
                                                        <SpkButton>nano</SpkButton>
                                                    </div>
                                                    <div className='pickr-container-primary'>
                                                        <div className='pickr'>
                                                            <SpkButton Customclass='pcr-button' onClickfunc={(ele:any) => {
                                                                if (ele.target.querySelector("input")) {
                                                                    ele.target.querySelector("input").click();
                                                                }
                                                            }}>
                                                                <switcherdata.Themebackgroundcolor theme={local_varaiable} actionfunction={ThemeChanger} />
                                                            </SpkButton>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="menu-image mb-3">
                                            <p className="switcher-style-head">Menu With Background Image:</p>
                                            <div className="d-flex flex-wrap align-items-center switcher-style">
                                                <div className="form-check switch-select m-2">
                                                    <input className="form-check-input bgimage-input bg-img1" type="radio"
                                                        name="menu-background" id="switcher-bg-img" checked={local_varaiable.bgImg == "bgimg1"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.bgImage(ThemeChanger, 'bgimg1')} />
                                                </div>
                                                <div className="form-check switch-select m-2">
                                                    <input className="form-check-input bgimage-input bg-img2" type="radio"
                                                        name="menu-background" id="switcher-bg-img1" checked={local_varaiable.bgImg == "bgimg2"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.bgImage(ThemeChanger, 'bgimg2')} />
                                                </div>
                                                <div className="form-check switch-select m-2">
                                                    <input className="form-check-input bgimage-input bg-img3" type="radio" name="menu-background" checked={local_varaiable.bgImg == "bgimg3"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.bgImage(ThemeChanger, 'bgimg3')}
                                                        id="switcher-bg-img2" />
                                                </div>
                                                <div className="form-check switch-select m-2">
                                                    <input className="form-check-input bgimage-input bg-img4" type="radio"
                                                        name="menu-background" id="switcher-bg-img3" checked={local_varaiable.bgImg == "bgimg4"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.bgImage(ThemeChanger, 'bgimg4')} />
                                                </div>
                                                <div className="form-check switch-select m-2">
                                                    <input className="form-check-input bgimage-input bg-img5" type="radio"
                                                        name="menu-background" id="switcher-bg-img4" checked={local_varaiable.bgImg == "bgimg5"} onChange={(_e) => { }}
                                                        onClick={() => switcherdata.bgImage(ThemeChanger, 'bgimg5')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                            <div className="d-flex justify-content-between canvas-footer flex-nowrap gap-2">
                                <Link  href="#!" id="reset-all" className="btn btn-danger m-1 text-nowrap w-100" onClick={() => switcherdata.Reset(ThemeChanger)}>Reset</Link>
                            </div>
                        </div>
                    </Tab.Container>
                </div>
            </HelmetProvider>
        </Fragment>
    )
}

const mapStateToProps = (state:any) => ({
    local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Switcher);