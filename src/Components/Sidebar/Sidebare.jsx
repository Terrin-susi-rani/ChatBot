import React from 'react';
import './sidebar.css';
import ai from '../../assets/ai.svg';
import explore from '../../assets/explore.svg'

const Sidebar = () => {

  const menuItems = [
    "ChatGPT",
    "Explore GPTs",
    "React App Structure Setup",
    "ModalSelector Integration Update"
  ];

  return (
    <div className="sidebar">
      <div className='card'>
       <img src={ai} alt='' className='icon'/>
        <p>Chatbot</p>
      </div>
      <div className='card'>
       <img src={explore} alt='' className='icon'/>
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
