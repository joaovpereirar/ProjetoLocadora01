import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../helper/dbconfig';

const registerRoutes = Router();

interface RegisterRequestBody {
  email: string;
  password: string;
  role: string;  // Adicionando o campo 'role' para aceitar o papel do usuário
}

registerRoutes.post('/', async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<Response> => {
  const { email, password, role } = req.body;  // Agora 'role' também é desestruturado

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, senha e papel são obrigatórios.' });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await pool.query('SELECT * FROM userlogin WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir novo usuário no banco de dados com o campo 'role'
    await pool.query(
      'INSERT INTO userlogin (email, password_hash, role) VALUES ($1, $2, $3)',  // Agora estamos inserindo o 'role'
      [email, hashedPassword, role]
    );

    return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default registerRoutes;
