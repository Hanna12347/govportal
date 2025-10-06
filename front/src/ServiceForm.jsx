import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceForm.css';

const ServiceForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    additionalInfo: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock services data - in real app, this would come from API
  const services = [
    {
      id: 'id-card',
      title: 'National ID Card',
      category: 'id',
      basePrice: 50,
      description: 'Apply for or renew your national identification card',
      estimatedTime: '15-20 business days',
      requirements: ['Proof of citizenship', 'Birth certificate', '2 passport photos'],
      fields: ['firstName', 'lastName', 'dateOfBirth', 'address']
    },
    {
      id: 'passport',
      title: 'Passport Application',
      category: 'id',
      basePrice: 145,
      description: 'Apply for a new passport or renew existing one',
      estimatedTime: '4-6 weeks',
      requirements: ['Current ID', 'Birth certificate', 'Passport photos'],
      fields: ['firstName', 'lastName', 'dateOfBirth', 'address', 'additionalInfo']
    },
    {
      id: 'drivers-license',
      title: 'Driver\'s License',
      category: 'license',
      basePrice: 85,
      description: 'Apply for driving license renewal or replacement',
      estimatedTime: '2-3 weeks',
      requirements: ['Current license', 'Eye test results', 'Proof of address'],
      fields: ['firstName', 'lastName', 'dateOfBirth', 'address']
    },
    {
      id: 'birth-certificate',
      title: 'Birth Certificate',
      category: 'id',
      basePrice: 25,
      description: 'Request a copy of birth certificate',
      estimatedTime: '5-10 business days',
      requirements: ['Proof of identity', 'Parents information'],
      fields: ['firstName', 'lastName', 'dateOfBirth', 'additionalInfo']
    },
    {
      id: 'vehicle-registration',
      title: 'Vehicle Registration',
      category: 'transport',
      basePrice: 120,
      description: 'Register your vehicle or renew registration',
      estimatedTime: '7-14 business days',
      requirements: ['Vehicle title', 'Insurance proof', 'Inspection certificate'],
      fields: ['firstName', 'lastName', 'address', 'additionalInfo']
    }
  ];

  useEffect(() => {
    // Find the selected service based on URL parameter
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setIsLoading(false);
    } else {
      navigate('/services');
    }
  }, [serviceId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (newServiceId) => {
    navigate(`/services/${newServiceId}`);
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    let total = selectedService.basePrice;
    // Add any additional fees based on form data
    if (formData.expeditedProcessing) total += 50;
    if (formData.deliveryOption === 'express') total += 25;
    
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { service: selectedService, formData });
    alert('Application submitted successfully!');
  };

  if (isLoading) {
    return (
      <div className="service-form-loading">
        <div className="loading-spinner"></div>
        <p>Loading service information...</p>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="service-form-error">
        <h2>Service not found</h2>
        <p>The requested service could not be found.</p>
        <button onClick={() => navigate('/services')}>Back to Services</button>
      </div>
    );
  }

  return (
    <div className="service-form-page">
      <div className="container">
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate('/services')} className="back-button">
            ← Back to Services
          </button>
          <h1>Apply for Government Service</h1>
          <p>Complete the form below to apply for your selected service</p>
        </div>

        <div className="form-layout">
          {/* Service Selection Sidebar */}
          <div className="service-sidebar">
            <h3>Available Services</h3>
            <div className="service-list">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`service-item ${selectedService.id === service.id ? 'active' : ''}`}
                  onClick={() => handleServiceChange(service.id)}
                >
                  <span className="service-icon">📋</span>
                  <div className="service-info">
                    <h4>{service.title}</h4>
                    <p className="service-price">${service.basePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div className="form-main">
            {/* Service Info Banner */}
            <div className="service-banner">
              <div className="banner-content">
                <h2>{selectedService.title}</h2>
                <p>{selectedService.description}</p>
                <div className="banner-details">
                  <span className="detail-item">
                    <strong>Fee:</strong> ${selectedService.basePrice}
                  </span>
                  <span className="detail-item">
                    <strong>Processing:</strong> {selectedService.estimatedTime}
                  </span>
                  <span className="detail-item">
                    <strong>Category:</strong> {selectedService.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="banner-price">
                <span className="price-label">Total</span>
                <span className="price-amount">${calculateTotal()}</span>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Address Information</h3>
                <div className="form-group">
                  <label htmlFor="address">Full Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    placeholder="Street address, city, state, ZIP code"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="additionalInfo">
                    {selectedService.id === 'passport' ? 'Passport Details' :
                     selectedService.id === 'vehicle-registration' ? 'Vehicle Information' :
                     'Additional Details'}
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder={
                      selectedService.id === 'passport' ? 'Previous passport number, travel plans...' :
                      selectedService.id === 'vehicle-registration' ? 'Vehicle make, model, year, VIN...' :
                      'Any additional information required for your application'
                    }
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Service Options</h3>
                <div className="options-grid">
                  <div className="option-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="expeditedProcessing"
                        checked={formData.expeditedProcessing || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          expeditedProcessing: e.target.checked
                        }))}
                      />
                      <span className="checkmark"></span>
                      Expedited Processing (+$50)
                    </label>
                    <p className="option-description">Get your application processed within 3-5 business days</p>
                  </div>
                  
                  <div className="option-group">
                    <label>Delivery Option</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === 'standard' || !formData.deliveryOption}
                          onChange={handleInputChange}
                        />
                        <span className="radiomark"></span>
                        Standard Delivery (Free)
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="express"
                          checked={formData.deliveryOption === 'express'}
                          onChange={handleInputChange}
                        />
                        <span className="radiomark"></span>
                        Express Delivery (+$25)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="requirements-section">
                <h4>Required Documents</h4>
                <ul className="requirements-list">
                  {selectedService.requirements.map((req, index) => (
                    <li key={index}>📄 {req}</li>
                  ))}
                </ul>
                <p className="requirements-note">
                  You will need to upload these documents after submitting this form.
                </p>
              </div>

              {/* Total and Submit */}
              <div className="form-total">
                <div className="total-breakdown">
                  <div className="breakdown-item">
                    <span>Service fee:</span>
                    <span>${selectedService.basePrice}</span>
                  </div>
                  {formData.expeditedProcessing && (
                    <div className="breakdown-item">
                      <span>Expedited processing:</span>
                      <span>+$50</span>
                    </div>
                  )}
                  {formData.deliveryOption === 'express' && (
                    <div className="breakdown-item">
                      <span>Express delivery:</span>
                      <span>+$25</span>
                    </div>
                  )}
                  <div className="breakdown-total">
                    <span>Total amount:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Submit Application - ${calculateTotal()}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;