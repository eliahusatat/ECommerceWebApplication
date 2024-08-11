import React from 'react';
//style
import './App.css';
//components
import GeneralModal from './components/GeneralModal/GeneralModal';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import AppRouter from './routes/AppRouter';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <AppRouter />
      <Footer />
      <GeneralModal />
      <Loader />
    </div>
  );
}

export default App;
