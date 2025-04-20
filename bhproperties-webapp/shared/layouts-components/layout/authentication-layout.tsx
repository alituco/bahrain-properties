
import store from '@/shared/redux/store';
import React, { Fragment } from 'react'
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import Switcher from '../switcher/switcher';

const Authenticationlayout = ({ children }: any) => {

  return (
    <Fragment>
      <Provider store={store}>
        <HelmetProvider>
        <Switcher />
          {children}
        </HelmetProvider>
      </Provider>
    </Fragment>
  )

}

export default Authenticationlayout;