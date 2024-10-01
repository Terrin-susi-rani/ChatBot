import React, { useState } from 'react';
import './navbar.css';
import day_logo from '../../assets/day.png';
import light_person from '../../assets/person_light.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const Menus = ['Profile', 'Help', 'Settings', 'Logout'];

  return (
    <div className="container">
      <img onClick={() => setOpen(!open)} src={light_person} alt="" className="toggle-icon" />
      <img src={day_logo} alt="" className="toggle-icon" />

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
