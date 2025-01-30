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
const categoriasRoutes = (0, express_1.Router)();
// Retornar todas as categorias
categoriasRoutes.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbconfig_1.default.query("SELECT * FROM categorias");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao buscar categorias " });
    }
}));
// Retorna categoria pelo Id
categoriasRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const result = yield dbconfig_1.default.query("SELECT * FROM categorias WHERE id = $1", [
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Error ao buscar categoria" });
    }
}));
// Adicionando uma nova categoria
categoriasRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { descricao } = req.body;
    if (!descricao || typeof descricao !== "string") {
        return res.status(400).json({
            campo: "descrição",
            error: "Nesse campo não é permitido números",
        });
    }
    try {
        const result = yield dbconfig_1.default.query("INSERT INTO categorias (descricao) VALUES ($1) RETURNING *", [descricao]);
        return res.status(201).json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao adicionar categoria" });
    }
}));
//Atualizar categoria por Id
categoriasRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { descricao } = req.body;
    if (!descricao || typeof descricao !== "string") {
        return res.status(400).json({
            campo: "descrição",
            error: "Nesse campo não é permitido números",
        });
    }
    try {
        const result = yield dbconfig_1.default.query("UPDATE categorias SET descricao = $1 WHERE id = $2 RETURNING *", [descricao, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        return res.json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
}));
//Remover categoria por ID
categoriasRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbconfig_1.default.query("DELETE FROM categorias WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        return res.status(200).json({ message: "Categoria removida com sucesso" });
    }
    catch (err) {
        return res.status(500).json({ error: "Erro ao remover categoria" });
    }
}));
exports.default = categoriasRoutes;
