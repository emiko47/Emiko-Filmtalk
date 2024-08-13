import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, removeUserSession } from './AuthServices';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeUserSession(); // Remove user session
    navigate('/'); // Redirect to the home page or login page
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">

        <ul className="navbar__menu">
          <li className="navbar__item">
            <Link to="/" className="navbar__links">Home</Link>
          </li>
          <li className="navbar__item">
            <Link to="/Filmtalk" className="navbar__links">Filmtalk</Link>
          </li>
          {isLoggedIn() && (
            <li className="navbar__item">
              <button onClick={handleLogout} className="navbar__links navbar__logout">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;