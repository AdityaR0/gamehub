import React, { useState } from 'react'; // <-- Make sure useState is imported
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoginModal from './LoginModal';

function MainLayout() {
  // This is the "brain" that controls the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="page-container">
      {/* This connects the "brain" to the "button" */}
      <Sidebar onLoginClick={openModal} />

      <main className="main-content-area">
        <Navbar />
        <Outlet /> 
        <Footer />
      </main>

      {/* This tells the modal when to be open */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default MainLayout;