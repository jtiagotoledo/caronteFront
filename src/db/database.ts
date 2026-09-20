import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("caronte.db");

export function iniciarBanco() {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS operacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        qnt_papeis INTEGER NOT NULL,
        data_compra TEXT NOT NULL,
        valor_compra REAL NOT NULL,
        data_venda TEXT,
        valor_venda REAL
    );
    
    CREATE TABLE IF NOT EXISTS dividendos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operacoes_id INTEGER NOT NULL,
        valor REAL NOT NULL,
        data_pagamento TEXT NOT NULL,
        FOREIGN KEY (operacoes_id) REFERENCES operacoes (id) ON DELETE CASCADE
    );
    `);
}

export function salvarOperacao(ticker: string, quantidade: number, dataCompra: string, valorCompra:number) {
    db.runSync(
        "INSERT INTO operacoes(ticker, qnt_papeis, data_compra, valor_compra) VALUES (?, ?, ?, ?);",
        [ticker, quantidade, dataCompra, valorCompra]
    );
    
}

export function buscarOperacoes() {
    return db.getAllSync<{id:number,ativo:string,preco:number}>(
        "SELECT * FROM operacoes ORDER BY id DESC;",
    );
}