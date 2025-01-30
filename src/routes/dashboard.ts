import { Router } from "express";
import pool from "../helper/dbconfig";

const dashboardRoutes = Router();

// Rota para obter o painel inicial
dashboardRoutes.get("/", async (_req, res) => {
  try {
    const totalVeiculosResult = await pool.query(
      "SELECT COUNT(*) FROM veiculos"
    );
    const totalMarcasResult = await pool.query("SELECT COUNT(*) FROM marcas");
    const totalCategoriasResult = await pool.query(
      "SELECT COUNT(*) FROM categorias"
    );
    const recentVeiculosResult = await pool.query(
      "SELECT * FROM veiculos ORDER BY id DESC LIMIT 10"
    );

    const totalVeiculos = totalVeiculosResult.rows[0].count;
    const totalMarcas = totalMarcasResult.rows[0].count;
    const totalCategorias = totalCategoriasResult.rows[0].count;
    const recentVeiculos = recentVeiculosResult.rows;

    res.json({
      totalVeiculos,
      totalMarcas,
      totalCategorias,
      recentVeiculos,
    });
  } catch (error) {
    console.error("Erro ao obter os dados do dashboard:", error);
    res.status(500).json({ error: "Erro ao obter os dados do dashboard" });
  }
});

export default dashboardRoutes;
