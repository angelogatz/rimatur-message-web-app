import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './Chat.css';

let socket; 

function Chat() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const messagesEndRef = useRef(null); 

  const myId = localStorage.getItem('userId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(scrollToBottom, [messages]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await axios.get('http://localhost:3001/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data); 
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/'); 
      return;
    }

    socket = io('http://localhost:3001', {
      query: { userId: myId }
    });

    socket.on('receiveMessage', (message) => {
        if (message.senderId === selectedUser?.id || message.receiverId === selectedUser?.id) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    });

    socket.on('refreshContacts', () => {
        fetchUsers(); 
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate, myId, selectedUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/'); 
        return;
    }
    fetchUsers(); 
  }, [navigate]); 

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    const token = localStorage.getItem('token');
    
    try {
        const historyResponse = await axios.get(`http://localhost:3001/messages/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(historyResponse.data);

        await axios.patch(`http://localhost:3001/messages/read/${user.id}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setUsers(prevUsers => prevUsers.map(u => 
            u.id === user.id ? { ...u, unreadCount: 0 } : u
        ));

    } catch (error) {
        console.error("Erro ao buscar/marcar mensagens:", error);
        setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const token = localStorage.getItem('token');
    const messageData = {
      content: newMessage,
      senderId: myId,
      receiverId: selectedUser.id,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:3001/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      socket.emit('sendMessage', response.data); 

      setNewMessage(''); 
    } catch (error) {
      alert('Erro ao enviar mensagem');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    if (socket) {
      socket.disconnect(); 
    }
    navigate('/'); 
  };
  
  return (
    <div className="chat-container"> 
      <div className="sidebar">
        <div>
            <h3>Contatos</h3>
            <ul className="contact-list">
            {users.map(user => (
                <li 
                key={user.id} 
                onClick={() => handleUserClick(user)}
                className={`contact-item ${selectedUser?.id === user.id ? 'selected' : ''}`} 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                {user.name}
                {user.unreadCount > 0 && (
                    <span style={{ 
                    backgroundColor: 'red', 
                    color: 'white', 
                    borderRadius: '50%', 
                    padding: '2px 8px', 
                    fontSize: '0.8em', 
                    fontWeight: 'bold'
                    }}
                    >
                    {user.unreadCount}
                    </span>
                )}
                </li>
            ))}
            </ul>
        </div>
        <button 
            onClick={handleLogout} 
            style={{ padding: '10px', width: '100%', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
        >
            Sair
        </button>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          {selectedUser ? (
            <span>Conversando com: {selectedUser.name}</span>
          ) : (
            <span>Selecione um contato para começar</span>
          )}
        </div>
        <div className="message-list">
          {messages
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(msg => {
            const isMe = msg.senderId === myId;
            return (
              <div 
                key={msg.id || msg.createdAt} 
                className={`message-bubble ${isMe ? 'me' : 'other'}`}
              >
                {msg.content}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {selectedUser && (
          <form onSubmit={handleSendMessage} className="message-form">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
            />
            <button type="submit">
              Enviar
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Chat;