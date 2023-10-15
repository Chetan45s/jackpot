import { tableName } from '../handlers/db';

export async function getUserById(userId: string, dataBase: () => any) {
  try {
    const body = {
      id: userId,
    };
    const query: string = `SELECT name, phone, bankDetails, walletBalance FROM ${tableName.USER}`;
    const userDetails = await dataBase().executeSelectQuery(query, body);
    return userDetails[0];
  } catch (err: any) {
    return new Error(err);
  }
}

export async function getUserByPhone(phone: string, dataBase: () => any) {
  const query: string = `SELECT id FROM ${tableName.USER} WHERE phone=${phone}`;
  const userDetails = await dataBase().executeQuery(query);
  return userDetails[0];
}
