import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col min-h-[calc(100vh-64px)]">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
