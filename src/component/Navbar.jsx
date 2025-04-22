// src/component/Navbar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive
        ? 'text-blue-500 dark:text-blue-400'
        : 'text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400'
    }`;

  return (
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo / Home link */}
          <NavLink to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="PokéCollector Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              PokéFighter
            </span>
          </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-4">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/poketeam" className={linkClasses}>
            My Team
          </NavLink>
          <NavLink to="/pokecards" className={linkClasses}>
            Pokédex
          </NavLink>
          <NavLink to="/battlehistory" className={linkClasses}>
            History
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <NavLink to="/" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/poketeam" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            My Team
          </NavLink>
          <NavLink to="/pokecards" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            Pokédex
          </NavLink>
          <NavLink to="/battlehistory" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            History
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
