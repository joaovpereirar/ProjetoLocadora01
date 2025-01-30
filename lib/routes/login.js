"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbconfig_1 = __importDefault(require("../helper/dbconfig"));
const loginRoutes = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
loginRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    try {
        // Buscar usuário pelo email
        const result = yield dbconfig_1.default.query('SELECT * FROM userlogin WHERE email = $1', [email]);
        const user = result.rows[0];
        // Verificar se o usuário existe
        if (!user) {
            return res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
        }
        // Verificar se a senha é válida
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ auth: false, message: 'Credenciais inválidas.' });
        }
        // Verificar se o campo 'role' existe e está definido
        if (!user.role) {
            return res.status(400).json({ message: 'Usuário não possui papel (role) definido.' });
        }
        // Gerar o token JWT
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, // Incluindo 'role' no payload
        JWT_SECRET, { expiresIn: '1h' });
        // Retornar o token
        return res.status(200).json({ auth: true, token });
    }
    catch (error) {
        console.error('Erro ao processar login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
exports.default = loginRoutes;
