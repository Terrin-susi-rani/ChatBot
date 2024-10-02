import React, { useState } from 'react';
import './navbar.css';
import user from '../../assets/user-icon.png'
import tab from '../../assets/sidebar.svg'


const Navbar = ({ sidebar, setSidebar }) => { // Destructure props correctly
  const [open, setOpen] = useState(false);
  const Menus = ['Profile', 'Help', 'Settings', 'Logout'];

  // Function to toggle the sidebar
  const handleSidebar = () => {
    setSidebar(!sidebar); // Properly invoke setSidebar
  };

  return (
    <div className="container">
      <img onClick={handleSidebar} src={tab} alt="" className="toggle-icon" />
      <img onClick={() => setOpen(!open)} src={user} alt="" className="user" />
      
      {open && (
        <div className="dropdown">
          <ul>
            {Menus.map((menu, index) => (
              <li onClick={() => setOpen(!open)} className="list" key={index}>
                {menu}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
