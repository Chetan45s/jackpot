import { Database } from 'bun:sqlite';
import { insertRow, updateTable } from './helper';

export interface IUser {
  id?: number;
  phone: string;
  name: string;
  createdAt: string;
  email: string;
}

export interface IGame {
  id?: number;
  createdAt: string;
  redCount: number;
  blueCount: number;
  winner: string;
  amountOnRed: number;
  amountOnBlue: number;
}

export interface IUserGame {
  id?: number;
  createdAt: string;
  gameId: number;
  userId: number;
  winningAmount: number;
  isWinner: boolean;
  amountOnRed: number;
  amountOnBlue: number;
}

export enum tableName {
  CODE = 'codedb',
  USER = 'userdb',
  GAME = 'gamedb',
  USER_GAME = 'usergamedb',
}

export class MJDatabase {
  public db: Database;

  constructor() {
    this.db = new Database('main.db', { create: true });
    // Initialize the database
    this.init()
      .then(() => console.log('Database initialized'))
      .catch((e: any) => console.error(e));
  }

  async executeQuery(query: string) {
    return this.db.query(query).all();
  }

  async addRow(tableName: string, body: object) {
    const { query, keyValue } = insertRow(tableName, body);
    return this.db.prepare(query).all(keyValue);
  }

  async updateRow(tableName: string, body: object, conditionBody: object) {
    const { query, keyValue } = updateTable(tableName, body, conditionBody);
    return this.db.prepare(query).all(keyValue);
  }

  // async deleteBook(id: number) {
  //   return this.db.run(`DELETE FROM books WHERE id = ${id}`);
  // }

  // Initialize the database
  async initCodeDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS codedb (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        otp VARCHAR(60), 
        phone VARCHAR(60)
        )`,
    );
  }

  async initUserDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS userdb (
        id INTEGER PRIMARY KEY, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(60), 
        email VARCHAR(60) NULL,
        phone VARCHAR(15),
        password VARCHAR(60),
        token TEXT NULL,
        refreshToken TEXT NULL
        )`,
    );
  }

  async initGameDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS gamedb (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        redCount INTEGER NULL, 
        blueCount INTEGER NULL, 
        winner INTEGER NULL, 
        amountOnRed INTEGER NULL,
        amountOnBlue INTEGER NULL
        )`,
    );
  }

  async initUserGameDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS usergamedb (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        gameId INTEGER, 
        userId INTEGER, 
        amountOnRed INTEGER,
        amountOnBlue INTEGER,
        isWinner INTEGER,
        winningAmount INTEGER NULL
        )`,
    );
  }

  async init() {
    try {
      await this.initCodeDb();
      await this.initUserDb();
      await this.initGameDb();
      await this.initUserGameDb();
    } catch (e: any) {
      console.error(e);
    }
  }
}
