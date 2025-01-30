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
const marcasRoutes = (0, express_1.Router)();
// Rota para retornar marcas com filtros
marcasRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, page = 1, limit = 10 } = req.query;
    let query = "SELECT * FROM marcas";
    const params = [];
    // Adiciona filtros dinamicamente
    [
        {
            param: nome,
            clause: "nome ILIKE $",
            parser: (value) => `%${value}%`,
        },
    ].forEach(({ param, clause, parser }) => {
        if (param) {
            params.push(parser(param)); // Adiciona o valor processado ao array de parâmetros
            if (params.length > 1) {
                query += ` AND ${clause}${params.length}`;
            }
            else {
                query += ` WHERE ${clause}${params.length}`;
            }
        }
    });
    // Adiciona paginação
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10); // Calcula o deslocamento
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);
    try {
        const result = yield dbconfig_1.default.query(query, params); // Executa a query com os parâmetros
        if (result.rows.length === 0) {
            return res
                .status(200)
                .json({ message: "Não há Marcas com os filtros aplicados" });
        }
        else {
            return res.json(result.rows); // Retorna os resultados
        }
    }
    catch (err) {
        console.error("Erro ao buscar marcas:", err);
        return res.status(500).json({ error: "Erro ao buscar marcas" });
    }
}));
// Retorna uma marca pelo ID
marcasRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("SELECT * FROM marcas WHERE id = $1", [
            idNum,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Marca não encontrada" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao buscar marca" });
    }
}));
// Adiciona uma nova marca
marcasRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome } = req.body;
    if (!nome || typeof nome !== "string") {
        return res
            .status(400)
            .json({
            campo: "nome",
            error: "Inválido, por favor digitar sem números",
        });
    }
    try {
        const result = yield dbconfig_1.default.query("INSERT INTO marcas (nome) VALUES ($1) RETURNING *", [nome]);
        return res.status(201).json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao adicionar marca" });
    }
}));
// Atualiza uma marca pelo ID
marcasRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome || typeof nome !== "string") {
        return res
            .status(400)
            .json({ campo: nome, error: "Nesse campo não é permitido números" });
    }
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("UPDATE marcas SET nome = $1 WHERE id = $2 RETURNING *", [nome, idNum]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Marca não encontrada" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao atualizar marca" });
    }
}));
// Remove uma marca pelo ID
marcasRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("DELETE FROM marcas WHERE id = $1 RETURNING *", [idNum]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Marca não encontrada" });
        }
        return res.json({ message: "Marca removida com sucesso" });
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao remover marca" });
    }
}));
exports.default = marcasRoutes;
