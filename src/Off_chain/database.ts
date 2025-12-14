import mysql from 'mysql2/promise';

const connectionOptions: mysql.PoolOptions = {
    host: 'localhost',
    user: 'root',
    password: 'khanhkhanh',
    database: 'mychain',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
}

export const initDatabase = async () => {
    console.log('Connecting...');
    try {
        const pool = mysql.createPool(connectionOptions);

        const connection = await pool.getConnection();
        console.log('Susccessfully connected to MySQL database');

        const Blocks = `
            create table if not exists blocks (
                hash varchar(64) primary key,
                previousHash varchar(64),
                nonce int,
                timestamp bigint,
                merkleRoot varchar(64)
            );
        `;

        const Transactions = `
            create table if not exists transactions (
                hash varchar(128) primary key,
                signature text,
                blockHash varchar(64),
                owner text,
                fee int,
                foreign key (blockHash) references blocks(hash)
            );
        `;

        await connection.query(Blocks);
        await connection.query(Transactions);

        connection.release();

        return pool;
    } catch (error) {
        console.error('Fail to init', error);
        process.exit(1); 
    }
}

