'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, isAuthenticated, logout } from '@/lib/auth';
import Image from 'next/image';
import graphyGraphic from './graphy-graphic.png';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      logout();
      // router.push('/profile'); // prevent going back (routing to profile) or logout so that jwt is deleted? or i can add loading with condition
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try { //after auth, redirect to profile
      await login(usernameOrEmail, password);
      router.push('/profile');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  };

 return (
  <div className="login-page-container">
    <div className="login-wrapper">
      <Image 
        src={graphyGraphic} 
        alt="graphy" 
        width={700}
        height={700}
        className="graphic-image"
      />
      <div className="login-content">
        <div className="login-box">
        <h2>LOGIN</h2>
          {error && (
            <div className="alert-error">
              {error}
            </div>
          )}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usernameOrEmail">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                required
                className="form-control"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn-primary"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}