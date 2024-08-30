import React, { useState, useEffect } from "react";
import './index.css';
import { isLoggedIn, setUserSession } from './AuthServices';
import { Link, useNavigate } from 'react-router-dom';
import ic1 from './movie-with-students-audience-svgrepo-com.svg'
import pic1 from './film-director-profession-director-movie-svgrepo-com (1).svg';
import pic2 from './chat-message-heart-svgrepo-com.svg';
import pic3 from './favorite-star-1-svgrepo-com.svg';
import { Button} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
  



    const [currentForm, setCurrentForm] = useState('login');
    const navigate = useNavigate();


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
         <div className='top_help'><nav className='navig'>
                    <img id='ico1'src={ic1}></img>
                    
                    <b>FilmTalk</b>
                    <p className='tag'>by Ebuka Emiko</p>
                </nav>
          </div>
         
          <div className='home_info'>
            <div className='featuress'>
              <div className='featuress_top'><img id='pic1' src={pic1}></img><p>Share Your Reviews</p></div>
              <p className='feat_text'>Got something to say about your favorite movies, shows, or series? Post your reviews and let the world know what you think. Didn't agree with a take on your favorite flick? No worries—drop your own review and set the record straight!</p>
            </div>
            <div className='featuress'>
              <div className='featuress_top'><img id='pic2' src={pic2}></img><p>Join the Converation</p></div>
              <p className='feat_text'>Every review comes with its own comment section, so don't hold back—jump in and share your thoughts. Whether you’re agreeing, disagreeing, or just adding your two cents, your voice matters.</p>
            </div>
            <div className='featuress'>
              <div className='featuress_top'><img id='pic3' src={pic3}></img>Show Some Love</div>
              <p className='feat_text'>Love a review? Hit that like button and save it to your watchlist for later. Keep track of all the titles that caught your eye, and make sure you never miss out on something worth watching!</p>
            </div>
          </div>
          {!isLoggedIn() && (
            <>
              <div className="form-toggle">
                <button className='form_butns' onClick={() => setCurrentForm('register')}>Register</button>&nbsp;
                <button className='form_butns' onClick={() => setCurrentForm('login')}>Login</button>
              </div>
              <div className="form-container">
                {renderForm()}
              </div>
            </>
          )}
          <div>
        
            
            <Link to="/Filmtalk" ><Button id='get_start'>Get Started &nbsp; <FontAwesomeIcon size='sm' icon={faRightFromBracket} style={{color: "white",}} /></Button></Link>
           

            
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
    <div className='form_container'>
      <h2 className='fom_title'>Log In</h2>
      <input className='form_inpt' type="text" id="login-username" placeholder="Username" />
      <input className='form_inpt' type="password" id="login-password" placeholder="Password" />
      <Button _hover={{ bg: '#3eaff6' }} backgroundColor='black' color='white'className='fom_act' onClick={handleLogin}>Log In</Button>
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
      <div className='form_container'>
        <h2 className='fom_title'>Register</h2>
        <input className='form_inpt' type="text" id="register-name" placeholder="Name" />
        <input className='form_inpt' type="text" id="register-username" placeholder="Username" />
        <input className='form_inpt' type="text" id="register-email" placeholder="Email" />
        <input className='form_inpt' type="password" id="register-password" placeholder="Password" />
        <Button _hover={{ bg: '#3eaff6' }} backgroundColor='black' color='white' className='fom_act' onClick={handleRegister}>Register</Button>
        {message && <p>{message}</p>}
      </div>
    );
};
  

export default Home;
