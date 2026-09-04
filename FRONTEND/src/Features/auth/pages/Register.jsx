import React from 'react'
import {  Link } from "react-router-dom";
 
const Register = () => {


const handleSubmit = (e) => {
  e.preventDefault();
}

  return (
   <main>
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          
          <div className = "input-group">
            <label htmlfor="User">Username</label>
              <input type="text" id="Username" name="Username" placeholder="Enter your username"/>
          </div>
          <div className = "input-group">
            <label htmlfor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email"/>
          </div>
          <div className = "input-group">
            <label htmlfor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password"/>
          </div>

           <button className="button primary-button">Register</button>
        </form>   
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register
