//services
import apiService from '../../services/apiService';
//style
import './SignForm.css';
//hooks
import React, { useState } from 'react';
//store
import { connect } from 'react-redux';
import { showModal } from '../../redux/actions/modalActions';


const SignForm = ({ type, onClose, showModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'signup' && formData.password !== formData.repeatPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      let endpoint = '';
      let msg = '';
      let data = {};
      const { username, email, password } = formData;
      if (type === 'signin') {
        data = { email, password };
        endpoint = 'User/login';
        msg = 'Sign In';
      } else {
        data = { username, email, password };
        endpoint = 'User/register';
        msg = 'Sign Up';
      }
      try {
        const response = await apiService.request(endpoint, data, 'post');
        if (response.status === 200) {
          showModal('success', `${msg} Successful`, 'You have successfully signed up!');
          if (type === 'signin') {
            // Save JWT token to local storage
            localStorage.setItem('jwtToken', response.data);
          }
        } else {
          showModal('error', `${msg} error`, response.message);
        }
      } catch (error) {
        showModal('error', `${msg} error`, error.message);
      }
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{type === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </>
          )}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {type === 'signup' && (
            <>
              <label>Repeat Password:</label>
              <input
                type="password"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
              />
            </>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit">{type === 'signin' ? 'Sign In' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  showModal,
};
export default connect(null, mapDispatchToProps)(SignForm);
