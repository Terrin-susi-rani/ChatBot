import React from 'react';
import './navbar.css';
import day_logo from '../../assets/day.png';
//import light_logo from '../../assets/night.png';
//import dark_person from '../../assets/person_dark.png';
import light_person from '../../assets/person_light.png';

 const Navbar = () => {
  // const toggle_mode = () => {
  //   setTheme(theme === 'light' ? 'dark' : 'light');
  //   console.log(theme);  // Logs the old theme before the state updates
  // };

  return (
    <div className={`container`}>
      <img src={light_person } alt="" className='toggle-icon' />
      <img 
        // onClick={toggle_mode} // Change from onCanPlay to onClick
        src={ day_logo} 
        alt="" 
        className='toggle-icon' 
      />
    </div>
  );
};

export default Navbar;
