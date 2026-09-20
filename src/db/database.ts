import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("caronte.db");

export function iniciarBanco() {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS ativos (
        id INTEGER  PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        preco REAL NOT NULL
    );   
    `);
    console.log('banco criado com sucesso');
}

export function salvarAtivo(ativo: string, preco: number) {
    db.runSync(
        "INSERT INTO ativos(ticker, preco) VALUES (?, ?);",
        [ativo, preco]
    );
    console.log('dados salvos');
    
}

export function buscarAtivos() {
    return db.getAllSync<{id:number,ativo:string,preco:number}>(
        "SELECT * FROM ativos ORDER BY id DESC;",
    );
}