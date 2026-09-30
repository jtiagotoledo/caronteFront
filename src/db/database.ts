import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("caronte.db");

export interface Operacao {
  id: number;
  ticker: string;
  nome: string;
  logo_url: string;
  qnt_papeis: number;
  data_compra: string;
  valor_compra: number;
  data_venda: string | null;
  valor_venda: number | null;
}

export interface TotalInvestido{
    total_investido: number | null;
}

export function iniciarBanco() {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS operacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        nome TEXT,
        logo_url TEXT,
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

export function salvarOperacao(ticker: string, nome:string, logo_url:string, quantidade: number, dataCompra: string, valorCompra: number) {
    const resultado = db.runSync(
        "INSERT INTO operacoes(ticker, nome, logo_url, qnt_papeis, data_compra, valor_compra) VALUES (?, ?, ?, ?, ?, ?);",
        [ticker, nome, logo_url, quantidade, dataCompra, valorCompra]
    );
    return resultado.changes>0;
}

export function alterarOperacao(id: string, ticker: string, quantidade: number, dataCompra: string, valorCompra: number) {
    const resultado = db.runSync(
        "UPDATE operacoes SET ticker = ?, qnt_papeis = ?, data_compra = ?, valor_compra = ? WHERE id = ?",
        [ticker, quantidade, dataCompra, valorCompra, id]
    );
    return resultado.changes>0;
}

export function deletarOperacao(id: number) {
    db.runSync("PRAGMA foreign_keys = ON;")
    const resultado = db.runSync("DELETE FROM operacoes WHERE id= ? ;", [id]);
    return resultado.changes>0;
}

export function buscarOperacoes(): Operacao[] {
    return db.getAllSync<Operacao>(
        "SELECT * FROM operacoes ORDER BY id DESC;",
    );
}

export function buscarTotalInvestido(): number {
    const resultado = db.getFirstSync<TotalInvestido>(
        "SELECT SUM(qnt_papeis*valor_compra) AS total_investido FROM operacoes WHERE data_venda IS null;"
    );
    return resultado?.total_investido ?? 0;
}