import React from 'react';

import Footer from '@/components/Footer/Footer';
import LayoutNoFooter from '@/components/Layout/LayoutNoFooter';

function Layout({ title, children }) {
  return (
    <>
      <LayoutNoFooter title={title}>{children}</LayoutNoFooter>
      <Footer />
    </>
  );
}

export default Layout;
