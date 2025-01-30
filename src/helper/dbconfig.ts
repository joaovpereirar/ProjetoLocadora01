import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'locadora_veiculos',
    password: '1234',
    port: 5432,
};

const pool = new Pool(poolConfig); // Inicialização correta do Pool

export default pool;