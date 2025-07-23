import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import menuItems from '../constants/MenuItems';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="Navbar">
      <header>
        <div className="container">
          <h1 className="logo">ZooAdmin</h1>
          <nav>
            <ul>

              {menuItems.map((item, index) => (
                <li key={index}>
                  <a onClick={() => handleNavigate(item.path)}>{item.label}</a>
                </li>
              ))}

            </ul>
          </nav>
          <div className={`burger ${isOpen ? 'burger-hidden' : ''}`} onClick={toggleMenu}>
            <div className={isOpen ? 'line1' : ''}></div>
            <div className={isOpen ? 'line2' : ''}></div>
            <div className={isOpen ? 'line3' : ''}></div>
          </div>

          {isOpen && 
            <div className="overlay" onClick={closeMenu}>
            </div>
          }

          <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <h2>ZooAdmin</h2>
              <button className="close-btn" onClick={closeMenu}>
              </button>
            </div>
            <ul>

              {menuItems.map((item, index) => (
                <li key={index}>
                  <a onClick={() => handleNavigate(item.path)}>
                    {item.label}
                  </a>
                </li>
              ))}

            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
