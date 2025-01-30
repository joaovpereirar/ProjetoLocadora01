import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../helper/dbconfig';

const loginRoutes = Router();
const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret_key';

interface LoginRequestBody {
  email: string;
  password: string;
}

loginRoutes.post('/', async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    // Buscar usuário pelo email
    const result = await pool.query('SELECT * FROM userlogin WHERE email = $1', [email]);
    const user = result.rows[0];

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
    }

    // Verificar se a senha é válida
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
    }

    // Verificar se o campo 'role' existe e está definido
    if (!user.role) {
      return res.status(400).json({ message: 'Usuário não possui papel (role) definido.' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },  // Incluindo 'role' no payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar o token
    return res.status(200).json({ auth: true, token });

  } catch (error) {
    console.error('Erro ao processar login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default loginRoutes;
