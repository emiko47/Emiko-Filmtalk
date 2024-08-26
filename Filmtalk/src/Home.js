import React, { useState } from "react";
import './index.css';
import { isLoggedIn, setUserSession } from './AuthServices';

const Home = () => {
    const [currentForm, setCurrentForm] = useState('login');
    


    const renderForm = () => {
      switch (currentForm) {
        case 'register':
          return <RegisterForm />;
        default:
          return <LoginForm />;
      }
    };


    return (
        <div className='fullpage'>
          <div className='home_title'>
            <h1>Filmtalk</h1>
          </div>
          <div className='home_info'>
            <h2>Welcome to Filmtalk!</h2>
            <p>FilmTalk is a film-centered social blog site I've built from scratch with React, Javascript, and AWS Services. I am a film enthusiast and I mostly enjoy "dialogue driven dramas that explore the human condition". I decided to make this site so I can share my thoughts and opinions with everyone, and let people share their thoughts on these films as well. I hope this site finds individuals who are as interested in film as I am.</p>
          </div>
          {!isLoggedIn() && (
            <>
              <div className="form-toggle">
                <button onClick={() => setCurrentForm('register')}>Register</button>
                <button onClick={() => setCurrentForm('login')}>Login</button>
              </div>
              <div className="form-container">
                {renderForm()}
              </div>
            </>
          )}
          <div>
            <p>Need help?</p>
            <button>Contact Support</button>
          </div>
        </div>
      );



}


const LoginForm = () => {
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;

    try {
      const response = await fetch(process.env.REACT_APP_LOGIN_URL, {//login url is called from environment variables here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_TOKEN,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserSession(data.user, data.token); // Save user session
        setMessage('Login successful!');
        // Optionally, redirect or update state as needed
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      <input type="text" id="login-username" placeholder="Username" />
      <input type="password" id="login-password" placeholder="Password" />
      <button onClick={handleLogin}>Log In</button>
      {message && <p>{message}</p>}
    </div>
  );
};

const RegisterForm = () => {
    const [message, setMessage] = useState('');
  
    const handleRegister = async () => {
      const name = document.querySelector('#register-name').value;
      const username = document.querySelector('#register-username').value;
      const email = document.querySelector('#register-email').value;
      const password = document.querySelector('#register-password').value;
  
      try {
        const response = await fetch(process.env.REACT_APP_REGISTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_API_TOKEN,
          },
          body: JSON.stringify({ name, username, email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage('Registration successful!');
          // Optionally, redirect or update state as needed
        } else {
          setMessage(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      }
    };
  
    return (
      <div>
        <h2>Register</h2>
        <input type="text" id="register-name" placeholder="Name" />
        <input type="text" id="register-username" placeholder="Username" />
        <input type="text" id="register-email" placeholder="Email" />
        <input type="password" id="register-password" placeholder="Password" />
        <button onClick={handleRegister}>Register</button>
        {message && <p>{message}</p>}
      </div>
    );
};
  

export default Home;
