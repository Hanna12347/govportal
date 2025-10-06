import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Signup.jsx";
import Login from './Login.jsx';
import Home from './Home.jsx';
import Studentgrants from './Studentgrants.jsx';
import Profile from "./Profile.jsx";
import Payment from './Payment.jsx';
function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path='/' element={<Login/>} />
          <Route path="/studentgrants" element={<Studentgrants />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/payment' element= {<Payment />} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App
