import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./signup.css"

const Login = () => {
  const  [ formdata , setFormdata ] = useState({
    email:"",
    password:"",
    usertype:""
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit= async(e)=>{
    e.preventDefault();
    if (!formdata.email || !formdata.password){
      setMessage("oplease fill all the fields");
      return;
    }
    setLoading(true);
    setMessage("");
    try{
      const response = await fetch("/api/login",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formdata),
      })
      const data = await response.json();
      if (data.success){
        setMessage('Login successful! Redirecting...');
        setTimeout(()=>{
          navigate(data.navigate)
        },2000)
      }
      else{
        setMessage('Login failed: ' + data.message);
      }

    }catch(error){
      setMessage('Error: ' + error.message);
    }finally{
      setLoading(false)
    }
  }
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div>
      <div className="app">
      <div className="signup-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
            />
          </div>
           
          
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {message && <div className="message">{message}</div>}
        
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
    </div>
  )
}

export default Login
