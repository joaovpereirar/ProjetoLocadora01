"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const veiculos_1 = __importDefault(require("./veiculos"));
const categorias_1 = __importDefault(require("./categorias"));
const marcas_1 = __importDefault(require("./marcas"));
const login_1 = __importDefault(require("./login"));
const dashboard_1 = __importDefault(require("./dashboard"));
const register_1 = __importDefault(require("./register"));
const router = (0, express_1.Router)();
router.use('/veiculos', veiculos_1.default);
router.use('/categorias', categorias_1.default);
router.use('/marcas', marcas_1.default);
router.use('/login', login_1.default);
router.use('/login/register', register_1.default);
router.use('/dashboard', dashboard_1.default);
exports.default = router;
