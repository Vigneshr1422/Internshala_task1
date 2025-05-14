import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full text-white shadow-md z-50" style={{ backgroundColor: '#1d4ed8' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">BabyCode</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <a href="/" className="hover:underline">Home</a>
          <a href="/#features" className="hover:underline">Features</a>
          <a href="/#about" className="hover:underline">About</a>
          <a href="/#contact" className="hover:underline">Contact</a>
                    <a href="/login" className="hover:underline">Login</a>

        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col gap-4 px-4 py-2 bg-blue-800">
          <a href="/" className="text-white hover:underline">Home</a>
          <a href="#features" className="text-white hover:underline">Features</a>
          <a href="#about" className="text-white hover:underline">About</a>
          <a href="#contact" className="text-white hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
