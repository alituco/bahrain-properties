"use client";

import React, { ReactNode } from "react";
import MarketplaceHeader from "../marketplace-header";
import Footer from "../footer/footer";

const BlankLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>
  <MarketplaceHeader />
  {children}
  <Footer />
  </>;
};

export default BlankLayout;
