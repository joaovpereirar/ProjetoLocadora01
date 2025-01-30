import { Router, Request, Response } from "express";
import pool from "../helper/dbconfig";

const marcasRoutes = Router();

// Rota para retornar marcas com filtros
marcasRoutes.get("/", async (req: Request, res: Response) => {
  const { nome, page = "1", limit = "10" } = req.query;

  let query = "SELECT * FROM marcas";
  const params: (string | number)[] = [];
  let conditions: string[] = [];

  // Adiciona filtro pelo nome
  if (nome) {
    conditions.push(`nome ILIKE $${params.length + 1}`);
    params.push(`%${nome}%`);
  }

  // Monta a query com os filtros
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Paginação
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limitNum, offset);

  try {
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nenhuma marca encontrada com os filtros aplicados." });
    }
    return res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar marcas:", err);
    return res.status(500).json({ error: "Erro ao buscar marcas." });
  }
});

// Retorna uma marca pelo ID
marcasRoutes.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const result = await pool.query("SELECT * FROM marcas WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Marca não encontrada." });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar marca." });
  }
});

// Adiciona uma nova marca
marcasRoutes.post("/", async (req: Request, res: Response) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== "string") {
    return res.status(400).json({ campo: "nome", error: "Nome inválido." });
  }

  try {
    const result = await pool.query("INSERT INTO marcas (nome) VALUES ($1) RETURNING *", [nome]);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao adicionar marca." });
  }
});

// Atualiza uma marca pelo ID
marcasRoutes.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { nome } = req.body;

  if (isNaN(id) || !nome || typeof nome !== "string") {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  try {
    const result = await pool.query("UPDATE marcas SET nome = $1 WHERE id = $2 RETURNING *", [nome, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Marca não encontrada." });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar marca." });
  }
});

// Remove uma marca pelo ID
marcasRoutes.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const result = await pool.query("DELETE FROM marcas WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Marca não encontrada." });
    }
    return res.json({ message: "Marca removida com sucesso." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao remover marca." });
  }
});

export default marcasRoutes;
