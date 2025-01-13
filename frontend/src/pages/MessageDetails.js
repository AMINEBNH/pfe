import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MessageDetails.css';

const MessageDetails = () => {
  const { id } = useParams();

  return (
    <div className="message-details-container">
      <h2>Message #{id}</h2>
      <p><strong>Expéditeur :</strong> Prof. Dupont</p>
      <p><strong>Objet :</strong> Rappel : Devoir à rendre</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

      <form className="reply-form">
        <textarea placeholder="Répondre..." rows="4"></textarea>
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
};

export default MessageDetails;
