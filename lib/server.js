"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
// Conexão com a porta
const app = (0, express_1.default)();
const port = 3002;
// Middleware para parsing JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Usando as rotas
app.use("/api", routes_1.default);
// Inicializando o servidorf
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
