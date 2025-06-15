import { NextPage } from "next";

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: "BlankLayout" | "ContentLayout" | string;
};
