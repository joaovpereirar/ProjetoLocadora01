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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbconfig_1 = __importDefault(require("../helper/dbconfig"));
const registerRoutes = (0, express_1.Router)();
registerRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body; // Agora 'role' também é desestruturado
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, senha e papel são obrigatórios.' });
    }
    try {
        // Verificar se o usuário já existe
        const userExists = yield dbconfig_1.default.query('SELECT * FROM userlogin WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já cadastrado.' });
        }
        // Criptografar a senha
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Inserir novo usuário no banco de dados com o campo 'role'
        yield dbconfig_1.default.query('INSERT INTO userlogin (email, password_hash, role) VALUES ($1, $2, $3)', // Agora estamos inserindo o 'role'
        [email, hashedPassword, role]);
        return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
exports.default = registerRoutes;
