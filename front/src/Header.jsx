import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="egov-header">

      
      <nav className="header-main">
        <div className="container">
          <div className="header-content">
            
            <Link to="/" className="brand">
              <div className="logo">
                <span></span>
              </div>
              <div className="brand-text">
                <h1>E-Government Services</h1>
                <p>Citizen Services Portal</p>
              </div>
            </Link>

           
            <div className="desktop-nav">
              
              
          
                <div className="user-menu">
                  <span className="user-greeting">Welcome, {user.name}</span>
                  <div className="dropdown">
                    <button className="user-btn">
                       {user.usertype} open
                    </button>
                    <div className="dropdown-content">
                      <Link to="/profile">My Profile</Link>
                      <Link to="/home">Dashboard</Link>
                    </div>
                  </div>
                </div>
             
            </div>

           
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              
            </button>
          </div>
        </div>
      </nav>

      
      {isMenuOpen && (
        <div className="mobile-nav">
          
          {user.email ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;