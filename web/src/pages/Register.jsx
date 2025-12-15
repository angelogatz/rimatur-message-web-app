import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../pages/Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/users", {
        name,
        email,
        password,
      });

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/"); 
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar. Verifique os dados ou tente outro e-mail.");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h2>Crie sua conta</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "10px" }}
          />
          <input
            type="email"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px" }}
          />

          <input
            type="password"
            placeholder="Sua Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px" }}
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            CADASTRAR
          </button>
          <Link
            to="/"
            style={{ textAlign: "center", marginTop: "10px", color: "#007bff" }}
          >
            Já tenho uma conta
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
