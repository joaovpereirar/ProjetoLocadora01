"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const poolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'locadora_veiculos',
    password: '1234',
    port: 5432,
};
const pool = new pg_1.Pool(poolConfig); // Inicialização correta do Pool
exports.default = pool;
