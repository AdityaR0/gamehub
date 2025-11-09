import React, { useState } from 'react'; // <-- Make sure useState is imported
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';

function GameLayout() {
  // This is the "brain" for this layout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="page-container">
      {/* This connects the "brain" to the "button" */}
      <Sidebar onLoginClick={openModal} />

      <main className="main-content-area game-layout-main">
        <div className="game-content text-content">
          <Outlet /> 
        </div>
      </main>

      {/* This tells the modal when to be open */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default GameLayout;