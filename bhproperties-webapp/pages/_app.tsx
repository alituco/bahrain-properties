import '../styles/globals.scss';                           

import ContentLayout from '@/shared/layouts-components/layout/content-layout';
import Authenticationlayout from '@/shared/layouts-components/layout/authentication-layout';

const layouts: Record<string, React.FC<any>> = {
  ContentLayout: ContentLayout,
  Authenticationlayout: Authenticationlayout,
};

function MyApp({ Component, pageProps }: any) {
  const Layout = layouts[Component.layout] ||
                 (({ children }: any) => <>{children}</>);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
