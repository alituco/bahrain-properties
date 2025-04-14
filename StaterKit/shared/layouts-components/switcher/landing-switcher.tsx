import { Fragment, useEffect } from 'react';
import Themeprimarycolor, * as switcherdata from "../../data/switcherdata/switcherdata";
import { connect } from "react-redux";
import { ThemeChanger } from "../../redux/action";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import store from '../../redux/store';
import SpkButton from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';

const Landingswitcher = ({ local_varaiable, ThemeChanger }:any) => {
    useEffect(() => {
        console.log(ThemeChanger);
        switcherdata.LocalStorageBackup(ThemeChanger);

    }, []);
    const Switcherclose = () => {

        if (document.querySelector(".offcanvas-end")?.classList.contains("show")) {
            document.querySelector(".offcanvas-end")?.classList.remove("show");
            document.querySelector(".switcher-backdrop")?.classList.remove("d-block");
            document.querySelector(".switcher-backdrop")?.classList.add("d-none");
        }
    };
    const customStyles:any = ` ${local_varaiable.colorPrimaryRgb != '' ? `--primary-rgb:${local_varaiable.colorPrimaryRgb}` : ''}`;
    useEffect(() => {
        const theme = store.getState();
        ThemeChanger({
            ...theme,
            "dataNavStyle": "menu-click",
            "dataNavLayout": "horizontal"
        });
        return () => {
            ThemeChanger({
                ...theme,
                "dataNavStyle": "",
                "dataNavLayout": `${localStorage.xintralayout == 'horizontal' ? 'horizontal' : 'vertical'}`
            });
        };
    }, []);
    return (
        <Fragment>
            <HelmetProvider>
                <Helmet>
                    <html dir={local_varaiable.dir}
                        data-theme-mode={local_varaiable.dataThemeMode}
                        data-menu-position={local_varaiable.dataMenuPosition}
                        data-nav-layout={local_varaiable.dataNavLayout}
                        data-nav-style={local_varaiable.dataNavStyle}
                        data-toggled={local_varaiable.toggled}
                        style={customStyles}>
                    </html>

                </Helmet>
                <div className="switcher-backdrop d-none" onClick={() => {
                    Switcherclose();
                }}></div>
                <div className="offcanvas offcanvas-end" tabIndex={-1} id="switcher-canvas" aria-labelledby="offcanvasRightLabel">
                    <div className="offcanvas-header border-bottom">
                        <h5 className="offcanvas-title" id="offcanvasRightLabel">Switcher</h5>
                        <SpkButton Buttonvariant="" Buttontype="button" Customclass="btn-close" Buttondismiss="offcanvas" Buttonlabel="Close" onClickfunc={() => { Switcherclose(); }}></SpkButton>

                    </div>
                    <div className="offcanvas-body">
                        <div className="">
                            <p className="switcher-style-head">Theme Color Mode:</p>
                            <div className="row switcher-style">
                                <div className="col-4">
                                    <div className="form-check switch-select">
                                        <label className="form-check-label" htmlFor="switcher-light-theme">
                                            Light
                                        </label>
                                        <input  readOnly className="form-check-input" type="radio" name="theme-style" id="switcher-light-theme"
                                            checked={local_varaiable.dataThemeMode !== 'dark'}
                                            onClick={() => switcherdata.Light(ThemeChanger)}
                                        />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check switch-select">
                                        <label className="form-check-label" htmlFor="switcher-dark-theme">
                                            Dark
                                        </label>
                                        <input readOnly className="form-check-input" type="radio" name="theme-style" id="switcher-dark-theme"
                                            checked={local_varaiable.dataThemeMode == 'dark'} onChange={(_e) => { }}
                                            onClick={() => switcherdata.Dark(ThemeChanger, "clicked")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <p className="switcher-style-head">Directions:</p>
                            <div className="row switcher-style">
                                <div className="col-4">
                                    <div className="form-check switch-select">
                                        <label className="form-check-label" htmlFor="switcher-ltr">
                                            LTR
                                        </label>
                                        <input readOnly className="form-check-input" type="radio" name="direction" id="switcher-ltr"
                                            checked={local_varaiable.dir == 'ltr'} onChange={(_e) => { }}
                                            onClick={() => { switcherdata.Ltr(ThemeChanger); }} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check switch-select">
                                        <label className="form-check-label" htmlFor="switcher-rtl">
                                            RTL
                                        </label>
                                        <input readOnly className="form-check-input" type="radio" name="direction" id="switcher-rtl"
                                            checked={local_varaiable.dir == 'rtl'} onChange={(_e) => { }}
                                            onClick={() => { switcherdata.Rtl(ThemeChanger); }} />
                                    </div>
                                </div>
                            </div>
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
                                                            <SpkButton Customclass='pcr-button' onClickfunc={(ele: any) => {
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
                        <div>
                            <p className="switcher-style-head">reset:</p>
                            <div className="text-center">
                                <SpkButton Id="reset-all" Buttonvariant="danger" Customclass="mt-3" onClickfunc={() => switcherdata.Reset1(ThemeChanger)}>Reset</SpkButton>

                            </div>
                        </div>
                    </div>
                </div>
            </HelmetProvider>
        </Fragment>
    );
};

const mapStateToProps = (state: any) => ({
    local_varaiable: state
});
export default connect(mapStateToProps, { ThemeChanger })(Landingswitcher);

