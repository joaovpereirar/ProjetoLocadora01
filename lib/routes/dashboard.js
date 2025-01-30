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
const dashboardRoutes = (0, express_1.Router)();
// Rota para obter o painel inicial
dashboardRoutes.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalVeiculosResult = yield dbconfig_1.default.query("SELECT COUNT(*) FROM veiculos");
        const totalMarcasResult = yield dbconfig_1.default.query("SELECT COUNT(*) FROM marcas");
        const totalCategoriasResult = yield dbconfig_1.default.query("SELECT COUNT(*) FROM categorias");
        const recentVeiculosResult = yield dbconfig_1.default.query("SELECT * FROM veiculos ORDER BY id DESC LIMIT 10");
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
    }
    catch (error) {
        console.error("Erro ao obter os dados do dashboard:", error);
        res.status(500).json({ error: "Erro ao obter os dados do dashboard" });
    }
}));
exports.default = dashboardRoutes;
