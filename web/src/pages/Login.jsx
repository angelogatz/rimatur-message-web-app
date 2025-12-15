import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/users/login', {
        email,
        password
      });

      const token = response.data.token;
      const userId = response.data.user.id;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      navigate('/chat'); 

    } catch (error) {
      console.error(error);
      alert('Erro no login! Verifique e-mail e senha.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h2>Entrar no Rimatur Chat</h2>
        <form onSubmit={handleLogin} className="auth-form">
        
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px' }}
          />
        
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px' }}
          />
        
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            ENTRAR
          </button>
          <div className="auth-link-container">
            <span>Não tem conta? </span>
            <Link to="/register" style={{ color: '#007bff' }}>Cadastre-se aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;