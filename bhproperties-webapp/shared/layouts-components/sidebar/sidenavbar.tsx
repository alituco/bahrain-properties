import { Fragment, useEffect } from "react";
const Sidenavbar = () => {

    const onScroll = () => {
        const sections = document.querySelectorAll(".side-menu__item");
        const scrollPos =
            window.scrollY ||
            document.documentElement.scrollTop ||
            (document.querySelector("body")?.scrollTop || 0);

        sections.forEach((elem) => {
            const value:any = elem.getAttribute("href") ?? "";
            const refElement = document.querySelector(value); // Cast to HTMLElement
            if (refElement) {
                const scrollTopMinus = scrollPos + 73;
                if (
                    refElement.offsetTop <= scrollTopMinus &&
                    refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
                ) {
                    elem.classList.add("active");
                } else {
                    elem.classList.remove("active");
                }
            }
        });
    };

    const handleClick = (e:any) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute("href");
        const location = document.getElementById(target.substring(1))?.offsetTop;
        if (location !== undefined) {
            window.scrollTo({
                left: 0,
                top: location - 64,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        const pageLinks = document.querySelectorAll(".side-menu__item");
        pageLinks.forEach((elem) => {
            elem.addEventListener("click", handleClick);
        });

        return () => {
            // Clean up event listeners when the component unmounts
            pageLinks.forEach((elem) => {
                elem.removeEventListener("click", handleClick);
            });
        };
    }, []);

    return (
        <Fragment>
            <ul className="main-menu">
                <li className="slide"><a className="side-menu__item" href="#home"> <span className="side-menu__label">Home</span></a></li>
                {/* <!-- Start::slide --> */}
                <li className="slide">
                                    <a   href="#team" className="side-menu__item">
                                        <span className="side-menu__label">Team</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide -->
                            <!-- Start::slide --> */}
                                <li className="slide">
                                    <a   href="#pricing" className="side-menu__item">
                                        <span className="side-menu__label">Pricing</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide -->
                            <!-- Start::slide --> */}
                                <li className="slide">
                                    <a   href="#faqs" className="side-menu__item">
                                        <span className="side-menu__label">FAQ's</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide -->
                            <!-- Start::slide --> */}
                                <li className="slide">
                                    <a   href="#testimonials" className="side-menu__item">
                                        <span className="side-menu__label">Testimonials</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide -->
                            <!-- Start::slide --> */}
                                <li className="slide">
                                    <a   href="#contact" className="side-menu__item">
                                        <span className="side-menu__label">Contact Us</span>
                                    </a>
                                </li>
                                {/* <!-- End::slide --> */}
            </ul>
        </Fragment>
    );
};

export default Sidenavbar;
