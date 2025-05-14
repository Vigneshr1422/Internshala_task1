import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full text-center py-4 text-sm text-white shadow-md z-50" style={{ backgroundColor: '#4b5563' }}>
      <p>&copy; {new Date().getFullYear()} BabyCode All rights reserved.</p>
    </footer>
  );
};

export default Footer;
