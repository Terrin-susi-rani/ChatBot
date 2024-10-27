import React from 'react';
import { Link } from "react-router-dom";
import './sidebar.css';
import ai from '../../assets/bot_icon.svg';
import tab from '../../assets/sidebar.svg';

const Sidebar = ({ sidebar, setSidebar }) => { // Corrected props destructuring

  const menuItems = [
    "Whats is Programming",
    "How to make cookies?",
    "React App Structure Setup",
  ];

  const handleSidebar = () => {
    setSidebar(!sidebar); // Toggle the sidebar state
  }

  return (
    <div className="sidebar">

      
<div className='card'>
  {sidebar ? (
    <div className="tooltip">
      <img onClick={handleSidebar} src={tab} alt="Toggle Sidebar" className="toggle-icon" />
      <span className="tooltip-text">Close Side bar</span>
    </div>
  ) : null}
  <img src={ai} alt='Chatbot' className='toggle-icon' />
</div>

      <span className='title'>DASHBOARD</span>
      <div className='ulmenu'>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/dashboard">Explore</Link>
      <Link to="/dashboard">Create a new Chat</Link>

      </div>
      <hr />
      <span className='title'>RECENT CHATS</span>
<div className='ulmenu'>
  {menuItems.map((item, index) => (
    <Link key={index} to={`/${item.replace(/\s+/g, '-').toLowerCase()}`} className="menu-item">
      {item}
    </Link>
  ))}
</div>
<div className='borders'></div>
<hr />

<div className="upgrade">
        <img src={ai} alt=""  className="toggle-icon"/>
        <div className="texts">
          <span>Upgrade to AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
