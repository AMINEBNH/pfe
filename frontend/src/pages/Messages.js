import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const messages = [
    { id: 1, sender: 'Prof. Dupont', subject: 'Rappel : Devoir à rendre', time: '10h30' },
    { id: 2, sender: 'Administration', subject: 'Frais de scolarité', time: '09h00' },
    { id: 3, sender: 'Prof. Martin', subject: 'Nouveau cours ajouté', time: 'Hier' },
  ];

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <ul className="messages-list">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="message-item"
            onClick={() => navigate(`/messages/${msg.id}`)}
          >
            <div className="message-icon">📩</div>
            <div className="message-content">
              <p className="message-sender">{msg.sender}</p>
              <p className="message-subject">{msg.subject}</p>
              <p className="message-time">{msg.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
