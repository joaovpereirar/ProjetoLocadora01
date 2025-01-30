import express from 'express';
import router from './routes';
import cors from 'cors';
// Conexão com a porta
const app = express();
const port = 3002;

// Middleware para parsing JSON
app.use(express.json());

app.use(cors());

// Usando as rotas
app.use("/api", router);


// Inicializando o servidorf
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});