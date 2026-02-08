import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Optional: if using React Router
// import './BackButton.css';

const BackButton = () => {
//   const navigate = useNavigate();
 
  const handleBack = () => {
    // This sends the user back to the previous page in their history
    navigate(-1); 
    // OR if you want to force it to a specific page: navigate('/upload');
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <span className="arrow">&larr;</span>
      <span className="text">Upload New Resume</span>
    </button>
  );
};

export default BackButton;