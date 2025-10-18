import React from 'react';

const FloatingActionButton: React.FC = () => (
  <button
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#007bff',
      border: 'none',
      color: 'white',
      borderRadius: '50%',
      width: 56,
      height: 56,
      fontSize: 28,
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    }}
    onClick={() => alert('Create something awesome! 🚀')}
  >
    +
  </button>
);

export default FloatingActionButton;
