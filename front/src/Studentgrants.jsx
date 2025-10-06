
import { useState,useEffect } from 'react';
import "./studentgrants.css";
import { useNavigate } from 'react-router-dom';

const Studentgrants = () => {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: "",
    nationalId: "",
    dateOfBirth: "",
    contactInfo: '',
    message: '',
    upload: '',
    service: '',
    department: ""
  });

  const [error, setError] = useState({
    name: "",
    nationalId: "",
    dateOfBirth: "",
    contactInfo: '',
    message: '',
    upload: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);


  
  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then(res => res.json())
      .catch(err => console.error(err));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add the missing validateForm function
  const validateForm = () => {
    const errors = {};
    
    if (!formdata.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formdata.nationalId.trim()) {
      errors.nationalId = "National ID is required";
    }
    
    if (!formdata.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }
    
    if (!formdata.contactInfo.trim()) {
      errors.contactInfo = "Contact information is required";
    }
    
    return errors;
  };
 
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setError(formErrors);
    return;
  }

  const payload = {
    department: formdata.department,
    service: formdata.service
  };

  try {
    const res = await fetch('/api/studentgrants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok) {
  const requestId = data.data.id; 
  navigate('/payment', { state: { requestId, service: formdata.service } });
}else {
      alert(data.error || "Error submitting form");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting form");
  }
};


  if (isSubmitted) {
    return (
      <div className="success-message">
        <h2>Form Submitted Successfully! 🎉</h2>
        <p>Your student grant application has been received.</p>
        <button onClick={() => setIsSubmitted(false)}>Submit Another Application</button>
      </div>
    );
  }

  return (
    <div>
      <div className="form-container">
        <h2>Student Grants Application</h2>
        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formdata.name}
              onChange={handleChange}
              className={error.name ? 'error' : ''}
              placeholder="Enter your name"
            />
            {error.name && <span className="error-text">{error.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formdata.dateOfBirth}
              onChange={handleChange}
              className={error.dateOfBirth ? 'error' : ''}
            />
            {error.dateOfBirth && <span className="error-text">{error.dateOfBirth}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nationalId">National ID:</label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={formdata.nationalId}
              onChange={handleChange}
              className={error.nationalId ? 'error' : ''}
              placeholder="Enter your national ID"
            />
            {error.nationalId && <span className="error-text">{error.nationalId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information:</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formdata.contactInfo}
              onChange={handleChange}
              className={error.contactInfo ? 'error' : ''}
              placeholder="Phone number or email"
            />
            {error.contactInfo && <span className="error-text">{error.contactInfo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Information (Optional):</label>
            <textarea
              id="message"
              name="message"
              value={formdata.message}
              onChange={handleChange}
              rows="4"
              placeholder="Enter any additional information..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="upload">Upload Supporting Documents:</label>
            <input 
              type="file" 
              id="upload" 
              name="upload" 
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Choose the service:</label>
            <select 
              id="service" 
              name="service"
              value={formdata.service}
              onChange={handleChange}
            >
              <option value="">Select a service</option>
              <option value="Licenses">Licenses</option>
              <option value="Health">Health services</option>
              <option value="Education">Education</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Grant">Educational Grant</option>
              <option value="Financial Aid">Financial Aid</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Choose the department:</label>
            <select 
              id="department" 
              name="department"
              value={formdata.department}
              onChange={handleChange}
            >
              <option value="">Select a department</option>
              <option value="1">"Ministry of Health"</option>
              <option value="2">"Ministry of Education"</option>
              <option value="3">"Ministry of Interior"</option>
              <option value="4">"Ministry of Finance"</option>
              <option value="5">"Ministry of Transport"</option>
              <option value="6">"Ministry of Labor"</option>
              <option value="7">"Ministry of Agriculture"</option>
              <option value="8">"Ministry of Justice"</option>
              <option value="9">"Ministry of Foreign Affairs"</option>
              <option value="10">"Ministry of Environment"</option>
            </select>
          </div>

           <button type="submit" className="submit-btn">
        Submit Application
      </button>
        </form>
      </div>
    </div>
  );
};

export default Studentgrants;