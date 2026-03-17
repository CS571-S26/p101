import { useState } from 'react';
import './Auth.css';

function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="auth-container">
      {/* Left Panel - Hero */}
      <div className="auth-left">
        <div className="auth-overlay">
          <h2 className="auth-quote">
            TRAVEL IS THE ONLY THING YOU BUY THAT MAKES YOU HAPPIER
          </h2>
        </div>
        <div className="auth-left-socials">
          <span className="social-circle fb">f</span>
          <span className="social-circle tw">t</span>
          <span className="social-circle ig">ig</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right">
        <h1 className="auth-brand">Voyago</h1>

        <div className="auth-social-login">
          <button className="social-btn" aria-label="Login with Facebook">f</button>
          <button className="social-btn" aria-label="Login with Google">G+</button>
          <button className="social-btn" aria-label="Login with LinkedIn">in</button>
        </div>

        <p className="auth-divider">or use your email account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-icon">&#128100;</span>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="input-icon clickable"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁' : '🚫'}
            </span>
          </div>

          <a href="#" className="forgot-link">Forgot Your Password?</a>

          <button type="submit" className="auth-submit">ENTER</button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <span className="auth-switch-link" onClick={onSwitch}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
