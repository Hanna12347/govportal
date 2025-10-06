import { useState } from 'react'
import './signup.css'
import { useNavigate } from 'react-router-dom'


function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json();

      
      if (data.success) {
        setMessage('Signup successful!')
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      } else {
        setMessage('Signup failed: ' + data.message)
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="app">
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit">Sign Up</button>
          
        </form>
        
        {message && <div className="message">{message}</div>}
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  )
}

export default Signup;