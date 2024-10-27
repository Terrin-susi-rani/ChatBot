import React from 'react';
import './sidebar.css';
import ai from '../../assets/ai.svg';
import explore from '../../assets/explore.svg';
import tab from '../../assets/sidebar.svg';

const Sidebar = ({ sidebar, setSidebar }) => { // Corrected props destructuring

  const menuItems = [
    "ChatGPT",
    "Explore GPTs",
    "React App Structure Setup",
    "ModalSelector Integration Update"
  ];

  const handleSidebar = () => {
    setSidebar(!sidebar); // Toggle the sidebar state
  }

  return (
    <div className="sidebar">
      {sidebar ? (
        <div>
          <img onClick={handleSidebar} src={tab} alt="Toggle Sidebar" className="toggle-icon" />
        </div>
      ) : null}
      <div className='card'>
        <img src={ai} alt='Chatbot' className='ai' />
        <p>Chatbot</p>
      </div>
      <div className='card'>
        <img src={explore} alt='Explore' className='icon' />
        <p>Explore</p>
      </div>
      <div className='ulmenu'>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
