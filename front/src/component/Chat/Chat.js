import React, { useState, useEffect } from "react";
import ChatInput from './ChatInput/ChatInput';
import Messages from './Messages/Messages'
import { socket } from "../../socket";

const Chat = ({player}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  console.log("player from chat", player);
 
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      console.log('emiting sendMessage');
      socket.emit('sendMessage', {message: message, player:{name: player.name, roomId:player.socket.room} }, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <Messages messages={messages} name={player.name} />
          <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;