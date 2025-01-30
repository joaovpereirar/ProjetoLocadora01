import { Router, Request, Response } from "express";
import pool from "../helper/dbconfig";

const categoriasRoutes = Router();

categoriasRoutes.get("/", async (req: Request, res: Response) => {
  const { descricao } = req.query;
  let query = "SELECT * FROM categorias";
  const params: (string | number)[] = [];

  if (descricao) {
    query += " WHERE descricao ILIKE $1";
    params.push(`%${descricao}%`);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});
// Retorna categoria pelo Id

categoriasRoutes.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const result = await pool.query("SELECT * FROM categorias WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Error ao buscar categoria" });
  }
});

// Adicionando uma nova categoria
categoriasRoutes.post("/", async (req: Request, res: Response) => {
  const { descricao }: { descricao: string } = req.body;

  if (!descricao || typeof descricao !== "string") {
    return res.status(400).json({
      campo: "descrição",
      error: "Nesse campo não é permitido números",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categorias (descricao) VALUES ($1) RETURNING *",
      [descricao]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao adicionar categoria" });
  }
});

//Atualizar categoria por Id
categoriasRoutes.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descricao }: { descricao: string } = req.body;

  if (!descricao || typeof descricao !== "string") {
    return res.status(400).json({
      campo: "descrição",
      error: "Nesse campo não é permitido números",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE categorias SET descricao = $1 WHERE id = $2 RETURNING *",
      [descricao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

//Remover categoria por ID
categoriasRoutes.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categorias WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    return res.status(200).json({ message: "Categoria removida com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao remover categoria" });
  }
});

export default categoriasRoutes;
