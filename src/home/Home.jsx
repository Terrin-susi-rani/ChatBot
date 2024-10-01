import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import addBtn from '../assets/add-30.png';
import msg from "../assets/message.svg";
import home from '../assets/home.svg';
import saved from '../assets/bookmark.svg';
import rocket from '../assets/rocket.svg';
import sendBtn from '../assets/send.svg';
import user from '../assets/user-icon.png';
import gptImg from '../assets/chatgptLogo.svg';
import gptLogo from '../assets/chatgpt.svg';
import plus from '../assets/add.svg';
// import light_home from '../assets/home_dark.svg'
// import light_rocket from '../assets/rocket_dark.svg'
// import light_saved from '../assets/bookmark_dark.svg'

const Home = ({ theme, setTheme }) => { 
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Function to handle API call
  const callApi = async (message) => {
    try {
      const response = await fetch('http://localhost:5000/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ top_p: 3, message }), // Adjust payload as needed
      });

      if (response.ok) {
        const data = await response.json();
        return data.message || "No response from the server"; // Assuming the response contains a "message" field
      } else {
        console.error('API error:', response.status);
        return "Error: Could not get response from the server";
      }
    } catch (error) {
      console.error('Request error:', error);
      return "Error: Something went wrong";
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = { text: inputValue, type: 'outgoing', time: getCurrentTime() };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // Send request to the Flask API for response
    const response = await callApi(inputValue);

    // Add the response message from the API
    addAutoReply(response);
  };

  const addAutoReply = (response) => {
    const newMessage = { text: response, type: 'incoming', time: getCurrentTime() };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className={`App `}>
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="logo" className="logo" />
            <span className="brand">ChatBot</span>
          </div>
          <button className="midBtn">
            <img alt="add" src={addBtn} className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
            <button className="query">
              <img alt="query" src={msg} className="Query" /> What is programming
            </button>
          </div>
        </div>
        <div className="lowerSide">
          <div className="listItems">
            <img src={home}  alt="home" className="listitemsImg" />
            Home
          </div>
          <div className="listItems">
            <img src={saved} alt="saved" className="listitemsImg" />
            Saved
          </div>
          <div className="listItems">
            <img src={rocket} alt="rocket" className="listitemsImg" />
            Upgrade
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats" ref={chatContainerRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat ${msg.type} `}>
              <img src={msg.type === 'outgoing' ? user : gptImg} alt="" className="chatImg" />
              <p className="txt">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            <button className="plus">
              <img src={plus} alt='add' className='add'/>
            </button>
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Send a message..." />
            <button className="send" onClick={sendMessage}>
              <img src={sendBtn} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
