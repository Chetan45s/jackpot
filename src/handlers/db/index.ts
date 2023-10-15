import { Database } from 'bun:sqlite';
import { IGenericObject, deleteTable, getKeyValue, insertRow, updateTable } from './helper';

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
  CODE = 'codeDb',
  USER = 'userDb',
  GAME = 'gameDb',
  USER_GAME = 'userGameDb',
  WALLET_TXN = 'walletTxnDb',
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

  async executeQuery(query: string, keyValue: IGenericObject) {
    return this.db.prepare(query).all(keyValue);
  }

  async executeSelectQuery(query: string, body: IGenericObject) {
    const { keyValueString, keyValueObject } = getKeyValue(body);
    query += ` WHERE ${keyValueString.replace(',', ' AND ')}`;
    return this.db.prepare(query).all(keyValueObject);
  }

  async addRow(tableName: string, body: object) {
    const { query, keyValue } = insertRow(tableName, body);
    return this.db.prepare(query).all(keyValue);
  }

  async updateRow(tableName: string, body: object, conditionBody: object) {
    const { query, keyValue } = updateTable(tableName, body, conditionBody);
    return this.db.prepare(query).all(keyValue);
  }

  async deleteRow(tableName: string, conditionBody: object) {
    const { query, keyValue } = deleteTable(tableName, conditionBody);
    return this.db.prepare(query).all(keyValue);
  }

  // Initialize the database
  async initCodeDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS ${tableName.CODE} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        otp VARCHAR(60), 
        phone VARCHAR(60),
        source VARCHAR(60)
        )`,
    );
  }

  async initUserDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS ${tableName.USER} (
        id INTEGER PRIMARY KEY, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(60), 
        phone VARCHAR(15),
        password VARCHAR(60),
        token TEXT DEFAULT NULL,
        refreshToken TEXT DEFAULT NULL,
        bankDetails JSON DEFAULT NULL,
        walletBalance INTEGER DEFAULT 0
        )`,
    );
  }

  async initGameDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS ${tableName.GAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        redCount INTEGER DEFAULT NULL, 
        blueCount INTEGER DEFAULT NULL, 
        winner INTEGER DEFAULT NULL, 
        amountOnColors JSON DEFAULT NULL,
        userCountOnColors JSON DEFAULT NULL
        )`,
    );
  }

  async initUserGameDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS ${tableName.USER_GAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        gameId INTEGER, 
        userId INTEGER, 
        bettingAmount VARHCAR(10),
        colorSelected VARCHAR(10),
        isWinner BOOL DEFAULT 0,
        winningAmount INTEGER NULL
        )`,
    );
  }

  async initWalletTxnDb() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS ${tableName.WALLET_TXN} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        userId VARCHAR(60), 
        amount INTEGER DEFAULT 0,
        txnId VARCHAR(60)
        )`,
    );
  }
  async init() {
    try {
      await this.initCodeDb();
      await this.initUserDb();
      await this.initGameDb();
      await this.initUserGameDb();
      await this.initWalletTxnDb();
    } catch (e: any) {
      console.error(e);
    }
  }
}
