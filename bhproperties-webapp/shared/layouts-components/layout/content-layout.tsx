
import Footer from '@/shared/layouts-components/footer/footer';
import Header from '@/shared/layouts-components/header/header';
import Sidebar from '@/shared/layouts-components/sidebar/sidebar';
import Switcher from '@/shared/layouts-components/switcher/switcher';
import React, { Fragment } from 'react'
import Backtotop from '@/shared/layouts-components/backtotop/backtotop';
import Loader from '@/shared/layouts-components/loader/loader';
import store from '@/shared/redux/store';
import { Provider } from 'react-redux';

const ContentLayout = ({ children, }: any) => {

    return (
        <>
            <Provider store={store}>
                <Switcher />
                <Loader />
                <div className='page'>
                    <Header />
                    <Sidebar />
                    <div className='main-content app-content'>
                        <div className='container-fluid'>
                            {children}
                        </div>
                    </div>
                    <Footer />
                </div>
                <Backtotop />
            </Provider>
        </>
    )

}

export default ContentLayout;
