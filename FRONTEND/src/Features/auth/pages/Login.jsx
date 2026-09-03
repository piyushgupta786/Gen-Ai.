import React from 'react'
import "../auth.form.scss";

const Login = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <div className = "input-group">
            <label htmlfor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email"/>
          </div>
        </form>
        <form>
          <div className = "input-group">
            <label htmlfor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password"/>
          </div>
        </form>

        <button classname="button primary-button">Login</button>

      </div>
    </main>
    
  )
}

export default Login
