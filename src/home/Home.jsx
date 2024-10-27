import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import sendBtn from '../assets/send.svg';
import user from '../assets/user-icon.png';
import gptImg from '../assets/bot_icon.svg';
import plus from '../assets/add.svg';
import Sidebar from '../Components/Sidebar/Sidebare';
import tab from '../assets/sidebar.svg';

const Home = ({ sidebar, setSidebar }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filesToSend, setFilesToSend] = useState([]);
  const chatContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const Menus = ['Profile', 'Help', 'Settings', 'Logout'];
  const dropdownRef = useRef(null);

  const callApi = async (message) => {
    try {
      const response = await fetch('/api/method/scope.app.get_chatgpt_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: message }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.message || "No response from the server";
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
    if (inputValue.trim() === "" && filesToSend.length === 0) return;

    let newMessages = [];

    if (inputValue.trim() !== "") {
      newMessages.push({
        text: inputValue,
        type: 'outgoing',
        time: getCurrentTime(),
      });
    }

    filesToSend.forEach(file => {
      newMessages.push({
        text: file.name,
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        type: 'outgoing',
        time: getCurrentTime(),
      });
    });

    setChatMessages((prevMessages) => [...prevMessages, ...newMessages]);

    setInputValue('');
    setFilesToSend([]);

    const response = await callApi(inputValue || filesToSend.map(file => file.name).join(', '));
    const incomingMessage = { text: response, type: 'incoming', time: getCurrentTime() };
    setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
    setInputValue('');
     const textarea = document.querySelector('.chatTextarea');
   if (textarea) {
    textarea.style.height = 'auto'; 
   }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
    }));
    setFilesToSend((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handlePaste = async (e) => {
    const clipboardItems = e.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const fileUrl = URL.createObjectURL(file);
        const newFile = {
          name: file.name,
          fileUrl,
          fileType: file.type,
        };
        setFilesToSend((prevFiles) => [...prevFiles, newFile]);
        break;
      }
    }
  };

  const handleSidebarToggle = () => {
    setSidebar(!sidebar);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const clearFile = (index) => {
    setFilesToSend((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className={`App ${sidebar ? 'sidebar-open' : ''}`}>
      {!sidebar && (
        <div className="tooltip-container">
          <img
            onClick={handleSidebarToggle}
            src={tab}
            alt="Toggle Sidebar"
            style={{ width: "40px", height: "40px", margin: "10px" }}
          />
          <span className="tooltip-text">Open side bar</span>
        </div>
      )}
      {sidebar && <Sidebar sidebar={sidebar} setSidebar={setSidebar} />}

      <div className="main">
        <div className="chats" ref={chatContainerRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat ${msg.type}`}>
              <img
                src={msg.type === 'outgoing' ? user : gptImg}
                alt=""
                className="chatImg"
              />
              {msg.fileUrl ? (
                msg.fileType.startsWith('image/') ? (
                  <img src={msg.fileUrl} alt={msg.text} className="chatImage" />
                ) : (
                  <a href={msg.fileUrl} download={msg.text} className="fileLink">
                    {msg.text}
                  </a>
                )
              ) : (
                <p className="txt">{msg.text}</p>
              )}
            </div>
          ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              multiple
            />
            <button
              className="plus"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <img src={plus} alt="add" className="add" />
            </button>
           
            {!filesToSend.length ? (
            <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              e.target.style.height = "auto"; 
              e.target.style.height = `${Math.min(e.target.scrollHeight, 5 * 24)}px`; 
            }}
            placeholder="Got a question? Type it here.."
            onKeyDown={(e) => {
              handleKeyDown(e);
              if (e.key === 'Backspace' && inputValue.length === 1) {
                e.target.style.height = 'auto'; 
              }
            }}
            onPaste={handlePaste}
            rows={1}
            className="chatTextarea"
          />
           
            ) : (
              <div className="filePreviews">
                {filesToSend.map((file, index) => (
                  <div key={index} className="filePreview">
                    <img src={file.fileUrl} alt={file.name} className="previewImage" />
                    <button
                      className="clearPreview"
                      onClick={() => clearFile(index)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="send" onClick={sendMessage}>
            <img src={sendBtn} alt="send" />
          </button>
        </div>
      </div>

      <div>
        <img onClick={() => setOpen(!open)} src={user} alt="User" className="user" />
        {open && (
          <div className="dropdown" ref={dropdownRef}>
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
    </div>
  );
};

export default Home;
