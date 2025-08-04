import React from "react";
import Head from "next/head";
import favicon from "../../../public/logo.png";
const Seo = ({ title }:any) => {
	let i = `Manzil - ${title}`;
	return (
		<Head>
			<title>{i}</title>
			<link href={favicon.src} rel="icon"></link>
			<meta name="description" content="Manzil: where buyers meet listings and realtors run their business." />
			<meta name="author" content="Manzil" />
			<meta name="keywords" content="react bootstrap dashboard
admin dashboard template
react nextjs admin template
react next js admin dashboard
admin dashboard nextjs
next js admin dashboard
admin panel template react bootstrap
react bootstrap dashboard template
nextjs dashboard
next js dashboard template
react bootstrap admin template
react next js admin panel dashboard template
react admin dashboard template
dashboard template react bootstrap
admin and dashboard template"></meta>
</Head>

	);
};

export default Seo;
