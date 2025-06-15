import '../styles/globals.scss';

import { Poppins } from 'next/font/google';               
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

import ContentLayout from '@/shared/layouts-components/layout/content-layout';
import Authenticationlayout from '@/shared/layouts-components/layout/authentication-layout';
import BlankLayout from '@/shared/layouts-components/blank-layout';

const layouts: Record<string, React.FC<any>> = {
  ContentLayout: ContentLayout,
  Authenticationlayout: Authenticationlayout,
  BlankLayout: BlankLayout
};

function MyApp({ Component, pageProps }: any) {
  const Layout =
    layouts[(Component as any).layout] ||
    (({ children }: any) => <>{children}</>);

  return (
    <div className={poppins.className}>                   
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;
