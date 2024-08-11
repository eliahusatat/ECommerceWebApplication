//component
import SignForm from '../../components/SignForm/SignForm';
//style
import './Home.css';
//hooks
import React, { useState } from 'react';

const HomePage = () => {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to My Website</h1>
        <p>Your gateway to something amazing.</p>
        <div className="button-container">
          <button className="btn" onClick={() => openModal('signin')}>Sign In</button>
          <button className="btn" onClick={() => openModal('signup')}>Sign Up</button>
        </div>
      </header>
      <main className="home-main">
        <section className="home-section">
          <h2>About Us</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
        </section>
        <section className="home-section">
          <h2>Services</h2>
          <p>Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>
        </section>
        <section className="home-section">
          <h2>Contact</h2>
          <p>Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
        </section>
      </main>
      {modalType && <SignForm type={modalType} onClose={closeModal} />}
    </div>
  );
}

export default HomePage;
