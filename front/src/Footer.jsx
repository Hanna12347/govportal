import './Footer.css';

const Footer = () => {
  return (
    <footer className="egov-footer">

      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <h3>E-Government Services</h3>
              </div>
              <p>Providing secure and efficient digital services to citizens.</p>
              <p>Government of Example State</p>
            </div>
            <div className="footer-section">
              
              <div className="emergency-contacts">
                <h5>Emergency Contacts</h5>
                <p> Emergency: 911</p>
                <p>Citizen Helpdesk: 1-800-GOV-HELP</p>
              </div>
            </div>
            <div className="footer-section">
              <h4>Stay Informed</h4>
              <p>Subscribe to government updates and alerts</p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
              <div className="download-app">
                <p>Download Our App</p>
                <div className="app-badges">
                  <a href="#" className="app-badge"> App Store</a>
                  <a href="#" className="app-badge">Play Store</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2024 Government of Example State. All rights reserved.</p>
            </div>
            
            

            <div className="government-seal">
              <span>Official Government Portal</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;