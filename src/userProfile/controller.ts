import { tableName } from '../handlers/db';
import { IGenericObject } from '../handlers/db/helper';
import { getUserById } from './helpers';

export async function getProfile({ authCheck, set, dataBase, jwtAccess, request }: IGenericObject) {
  try {
    const { id: userId } = await authCheck({ set, dataBase, jwtAccess, request });
    const userDetails = await getUserById(userId, dataBase);

    set.status = 200;
    return {
      message: 'Success',
      userDetails,
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function updateProfile({ authCheck, body, set, dataBase, jwtAccess, request }: IGenericObject) {
  try {
    const { id: userId } = await authCheck({ set, dataBase, jwtAccess, request });
    const conditionBody = {
      id: userId,
    };
    await dataBase().updateRow(tableName.USER, body, conditionBody);

    set.status = 200;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function addMoney({ authCheck, set, body, dataBase, jwtAccess, request }: IGenericObject) {
  const { money, txnId } = body;
  try {
    const { id: userId } = await authCheck({ set, dataBase, jwtAccess, request });
    const userDetails = await getUserById(userId, dataBase);
    const { walletBalance = 0 } = userDetails;

    const currentBal = Number(walletBalance || 0);
    const moneyToAdd = Number(money);

    const totalBal = currentBal + moneyToAdd;

    const conditionBody = {
      id: userId,
    };

    const walletTxnBody = {
      amount: moneyToAdd,
      userId,
      txnId,
    };
    await dataBase().updateRow(tableName.USER, { walletBalance: totalBal }, conditionBody);
    await dataBase().addRow(tableName.WALLET_TXN, walletTxnBody);

    set.status = 200;
    return {
      message: 'Updated Wallet Balance',
      walletBalance: totalBal,
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function joinGame({ authCheck, set, body, dataBase }: IGenericObject) {
  const { colorSelected, bettingAmount, gameId } = body;
  try {
    const userId = await authCheck();

    const userGameBody = {
      gameId,
      userId,
      bettingAmount,
      colorSelected,
    };

    await dataBase().addRow(tableName.USER_GAME, userGameBody);

    set.status = 200;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}
