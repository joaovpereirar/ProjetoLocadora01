"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbconfig_1 = __importDefault(require("../helper/dbconfig"));
const veiculosRoutes = (0, express_1.Router)();
veiculosRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = req.query;
    let query = `
  SELECT
  v.id,
  v.modelo,
  v.ano,
  v.preco_diario,
  v.disponivel,
  m.nome AS marca,
  c.descricao AS categoria
  FROM veiculos v 
  JOIN marcas m ON v.id_marca = m.id 
  JOIN categorias c ON v.id_categoria = c.id `;
    const params = [];
    // Adiciona filtros dinamicamente
    [
        {
            param: req.query.modelo,
            clause: "v.modelo ILIKE $",
            parser: (value) => `%${value}%`,
        },
        {
            param: req.query.preco_min,
            clause: "v.preco_diario >= $",
            parser: Number,
        },
        {
            param: req.query.preco_max,
            clause: "v.preco_diario <= $",
            parser: Number,
        },
        { param: req.query.ano_min, clause: "v.ano >= $", parser: Number },
        { param: req.query.ano_max, clause: "v.ano <= $", parser: Number },
    ].forEach(({ param, clause, parser }) => {
        if (param && (typeof param === "string" || typeof param === "number")) {
            params.push(parser ? parser(param) : param);
            query += ` AND ${clause.replace("$", `$${params.length}`)}`;
        }
    });
    // Adiciona paginação
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit, 10), offset);
    try {
        const result = yield dbconfig_1.default.query(query, params);
        if (result.rows.length === 0) {
            return res
                .status(200)
                .json({ message: "Não há veículos com os filtros aplicados" });
        }
        else {
            return res.json(result.rows);
        }
    }
    catch (err) {
        console.error("Erro ao buscar veículos:", err);
        return res.status(500).json({ error: "Erro ao buscar veículos" });
    }
}));
// Retorna um veículo pelo ID
veiculosRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("SELECT * FROM veiculos WHERE id = $1 AND disponivel = true", [idNum]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao buscar veículo" });
    }
}));
// Adiciona um novo veículo
veiculosRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { modelo, ano, preco_diario, id_marca, id_categoria, disponivel } = req.body;
    const errors = [];
    // Validações
    if (!modelo || typeof modelo !== "string") {
        errors.push({
            campo: "modelo",
            erro: "Deve ser uma string.",
        });
    }
    if (!ano || !Number(ano)) {
        errors.push({
            campo: "ano",
            erro: "O campo ano deve ser um número inteiro.",
        });
    }
    if (!preco_diario || isNaN(preco_diario) || preco_diario <= 0) {
        errors.push({
            campo: "preco_diario",
            erro: "Deve ser um número positivo.",
        });
    }
    if (disponivel !== true && disponivel !== false) {
        errors.push({
            campo: "disponivel",
            erro: "O campo disponivel deve ser verdadeiro ou falso.",
        });
    }
    if (!id_marca || !Number(id_marca)) {
        errors.push({
            campo: "id_marca",
            erro: "O campo id_marca deve ser um número inteiro.",
        });
    }
    if (!id_categoria || !Number(id_categoria)) {
        errors.push({
            campo: "id_categoria",
            erro: "O campo id_categoria deve ser um número inteiro.",
        });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    try {
        const result = yield dbconfig_1.default.query("INSERT INTO veiculos (modelo, ano, preco_diario, id_marca, id_categoria, disponivel) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [modelo, ano, preco_diario, id_marca, id_categoria, disponivel]);
        return res.status(201).json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao adicionar veículo" });
    }
}));
// Atualiza as informações de um veículo pelo ID
veiculosRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { modelo, ano, preco_diario, id_marca, id_categoria, disponivel } = req.body;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    const errors = [];
    if (!modelo || typeof modelo !== "string") {
        errors.push({ campo: "modelo", erro: "Deve ser uma string." });
    }
    if (!ano || !Number(ano)) {
        errors.push({
            campo: "ano",
            erro: "O campo ano deve ser um número inteiro.",
        });
    }
    if (!preco_diario || isNaN(preco_diario) || preco_diario <= 0) {
        errors.push({
            campo: "preco_diario",
            erro: "Deve ser um número positivo.",
        });
    }
    if (disponivel !== true && disponivel !== false) {
        errors.push({
            campo: "disponivel",
            erro: "O campo disponivel deve ser verdadeiro ou falso.",
        });
    }
    if (!id_marca || !Number(id_marca)) {
        errors.push({
            campo: "id_marca",
            erro: "O campo id_marca deve ser um número inteiro.",
        });
    }
    if (!id_categoria || !Number(id_categoria)) {
        errors.push({
            campo: "id_categoria",
            erro: "O campo id_categoria deve ser um número inteiro.",
        });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    try {
        const result = yield dbconfig_1.default.query("UPDATE veiculos SET modelo = $1, ano = $2, preco_diario = $3, id_marca = $4, id_categoria = $5, disponivel = $6 WHERE id = $7 RETURNING *", [modelo, ano, preco_diario, id_marca, id_categoria, disponivel, idNum]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao atualizar veículo" });
    }
}));
// Remove um veículo pelo ID
veiculosRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("DELETE FROM veiculos WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        }
        return res.json({ message: "Veículo removido com sucesso" });
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao remover veículo" });
    }
}));
exports.default = veiculosRoutes;
