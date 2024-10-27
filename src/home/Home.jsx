import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import sendBtn from '../assets/send.svg';
import user from '../assets/user-icon.png';
import gptImg from '../assets/chatgptLogo.svg';
import plus from '../assets/add.svg';
import Sidebar from '../Components/Sidebar/Sidebare';
import tab from '../assets/sidebar.svg'

const Home = ({ sidebar ,setSidebar }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [fileToSend, setFileToSend] = useState(null); // State for file attachment
  const chatContainerRef = useRef(null);

  // Function to handle API call
  const callApi = async (message, isFile = false) => {
    try {
      const response = await fetch('/api/method/scope.app.get_chatgpt_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    if (inputValue.trim() === "" && !fileToSend) return;

    let newMessage;
    
    if (fileToSend) {
      newMessage = {
        text: fileToSend.name,
        fileUrl: fileToSend.fileUrl,
        fileType: fileToSend.fileType,
        type: 'outgoing',
        time: getCurrentTime()
      };
    } else {
      newMessage = { text: inputValue, type: 'outgoing', time: getCurrentTime() };
    }

    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
    setFileToSend(null); // Clear file attachment after sending

    // Send request to the API for response
    const response = await callApi(inputValue || fileToSend.name, !!fileToSend);

    // Add the response message from the backend
    const incomingMessage = { text: response, type: 'incoming', time: getCurrentTime() };
    setChatMessages(prevMessages => [...prevMessages, incomingMessage]);
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
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFileToSend({
        name: file.name,
        fileUrl,
        fileType: file.type
      });
    }
  };
  const handleSidebarToggle = () => {
    setSidebar(!sidebar);
  };


  const handlePaste = async (e) => {
    const clipboardItems = e.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const fileUrl = URL.createObjectURL(file);
        setFileToSend({
          name: file.name,
          fileUrl,
          fileType: file.type
        });
        break;
      }
    }
  };

  return (
    <div className={`App `}>
        {/* Toggle sidebar button */}
        {!sidebar && (
        <div  >
          <img onClick={handleSidebarToggle} src={tab} alt="Toggle Sidebar"  style={{ width: '40px', height: '40px',margin:'15px' }}  />
        </div>
      )}

      {/* Sidebar */}
      {sidebar && <Sidebar sidebar={sidebar} setSidebar={setSidebar} />}
     
      <div className="main">
        <div className="chats" ref={chatContainerRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat ${msg.type}`}>
              <img src={msg.type === 'outgoing' ? user : gptImg} alt="" className="chatImg" />
              {msg.fileUrl ? (
                msg.fileType.startsWith('image/') ? (
                  <img src={msg.fileUrl} alt={msg.text} className="chatImage" />
                ) : (
                  <a href={msg.fileUrl} download={msg.text} className="fileLink">{msg.text}</a>
                )
              ) : (
                <p className="txt">{msg.text}</p>
              )}
            </div>
          ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            {/* Hidden file input */}
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="plus" onClick={() => document.getElementById('fileInput').click()}>
              <img src={plus} alt="add" className="add" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Send a message..."
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}  // Added paste handler here
            />

            {/* Image/File preview section */}
            {fileToSend && fileToSend.fileType.startsWith('image/') && (
              <div className="imagePreviewInChatTab">
                <img src={fileToSend.fileUrl} alt={fileToSend.name} className="smallPreviewImage" />
                <button className="clearPreview" onClick={() => setFileToSend(null)}>✖</button>
              </div>
            )}

            <button className="send" onClick={sendMessage}>
              <img src={sendBtn} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;