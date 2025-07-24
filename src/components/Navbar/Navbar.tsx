import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import menuItems from '../../constants/MenuItems';
import UserRole from '../../models/entities/UserRole';
import MenuItem from '../../models/structs/MenuItem';
import User from '../../models/entities/User';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const getCurrentUserRole = (): UserRole => {
    const user: User = JSON.parse(localStorage.getItem('User')!);
    return user.role;
  };

  const filterMenuItems = (items: MenuItem[], userRole: UserRole): MenuItem[] => {
    return items.filter(item => {
      if (item.isSuperAdmin && userRole !== UserRole.SuperAdmin) {
        return false;
      }

      if (item.subItems) {
        item.subItems = filterMenuItems(item.subItems, userRole);
      }

      return true;
    });
  };

  const userRole = getCurrentUserRole();
  const filteredMenuItems = filterMenuItems([...menuItems], userRole);

  return (
    <div className="Navbar">
      <header>
        <div className="container">
          <h1 className="logo" onClick={() => handleNavigate('/')}>ZooAdmin</h1>
          <nav>
            <ul>
              {filteredMenuItems.map((item, index) => (
                <li key={index} className={item.subItems ? 'has-dropdown' : ''}>
                  <a onClick={() => handleNavigate(item.path)}>{item.label}</a>
                  {item.subItems && (
                    <ul className="dropdown">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a onClick={() => handleNavigate(subItem.path)}>
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="burger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          {isOpen && <div className="overlay" onClick={closeMenu}></div>}
          <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <h2>ZooAdmin</h2>
              <button className="close-btn" onClick={closeMenu}>&times;</button>
            </div>
            <ul>
              {filteredMenuItems.map((item, index) => (
                <li key={index}>
                  <a onClick={() => handleNavigate(item.path)}>{item.label}</a>
                  {item.subItems && (
                    <ul className="sidebar-submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a onClick={() => handleNavigate(subItem.path)}>
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
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
