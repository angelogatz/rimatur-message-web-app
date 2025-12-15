import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

const SECRET_KEY = process.env.JWT_SECRET; 

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  if (!SECRET_KEY) {
        console.error("ERRO: JWT_SECRET não definida no ambiente.");
        return res.status(500).json({ message: 'Erro de configuração do servidor.' });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY); 
      req.userId = decoded.userId;
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};