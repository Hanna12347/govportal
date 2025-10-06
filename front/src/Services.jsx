import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Service categories and data
  const serviceCategories = [
    { id: 'all', name: 'All Services' },
    { id: 'id', name: 'ID & Documents' },
    { id: 'license', name: 'Licenses'},
    { id: 'revenue', name: 'Revenue & Taxes' },
    { id: 'health', name: 'Health Services' },
    { id: 'education', name: 'Education'},
    { id: 'housing', name: 'Housing'},
    { id: 'transport', name: 'Transport'}
  ];

  const servicesData = [
    {
      id: 1,
      title: 'National ID Card',
      description: 'Apply for or renew your national identification card',
      category: 'id',
      popular: true,
      estimatedTime: '15-20 min',
      status: 'Available',
      link: '/services/id-card'
    },
    {
      id: 2,
      title: 'Passport Application',
      description: 'Apply for a new passport or renew existing one',
      category: 'id',
      popular: true,
      estimatedTime: '30-45 min',
      status: 'Available',
      link: '/services/passport'
    },
    {
      id: 3,
      title: 'Driver\'s License',
      description: 'Apply for driving license renewal or replacement',
      category: 'license',
      popular: true,
      estimatedTime: '20-30 min',
      status: 'Available',
      link: '/services/drivers-license'
    },
    {
      id: 4,
      title: 'Business License',
      description: 'Register or renew your business license',
      category: 'license',
      estimatedTime: '45-60 min',
      status: 'Available',
      link: '/services/business-license'
    },
    {
      id: 5,
      title: 'Tax Payment',
      description: 'Pay your income tax or property tax online',
      category: 'revenue',
      popular: true,
      estimatedTime: '10-15 min',
      status: 'Available',
      link: '/services/tax-payment'
    },
    {
      id: 6,
      title: 'Birth Certificate',
      description: 'Request a copy of birth certificate',
      category: 'id',
      estimatedTime: '15-25 min',
      status: 'Available',
      link: '/services/birth-certificate'
    },
    {
      id: 7,
      title: 'Health Insurance',
      description: 'Apply for government health insurance',
      category: 'health',
      estimatedTime: '25-35 min',
      status: 'Available',
      link: '/services/health-insurance'
    },
    {
      id: 8,
      title: 'Student Grants',
      description: 'Apply for educational grants and scholarships',
      category: 'education',
      estimatedTime: '30-40 min',
      status: 'Available',
      link: '/services/studentgrants'
    },
    {
      id: 9,
      title: 'Building Permit',
      description: 'Apply for construction and building permits',
      category: 'housing',
      estimatedTime: '40-50 min',
      status: '',
      link: '/services/building-permit'
    },
    {
      id: 10,
      title: 'Vehicle Registration',
      description: 'Register your vehicle or renew registration',
      category: 'transport',
      estimatedTime: '20-30 min',
      status: 'Available',
      link: '/services/vehicle-registration'
    },
    {
      id: 11,
      title: 'Marriage Certificate',
      description: 'Request marriage certificate copy',
      category: 'id',
      estimatedTime: '15-25 min',
      status: 'Available',
      link: ''
    },
    {
      id: 12,
      title: 'Social Security',
      description: 'Apply for social security benefits',
      category: 'health',
      estimatedTime: '35-45 min',
      status: 'Available',
      link: '/services/social-security'
    }
  ];

  const filteredServices = servicesData.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Government Services Portal</h1>
            <p>Access all government services in one place. Quick, secure, and convenient.</p>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {serviceCategories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>


      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {selectedCategory === 'all' ? 'All Services' : 
               serviceCategories.find(cat => cat.id === selectedCategory)?.name}
              <span className="services-count"> ({filteredServices.length} services)</span>
            </h2>
          </div>

          {filteredServices.length === 0 ? (
            <div className="no-results">
              <h3>No services found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="services-grid">
              {filteredServices.map(service => (
                <div key={service.id} className="service-card">
                  {service.status !== 'Available' && (
                    <div className="status-badge">{service.status}</div>
                  )}
                  
                  
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    
                    <div className="service-meta">
                      <span className="time-required">{service.estimatedTime}</span>
                      <span className={`availability ${service.status.toLowerCase()}`}>
                        {service.status}
                      </span>
                    </div>
                    
                    <Link to= "/studentgrants"  className="service-btn">
                      Access Service 
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;