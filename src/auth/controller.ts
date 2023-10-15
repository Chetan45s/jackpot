import { tableName } from '../handlers/db';
import { IGenericObject } from '../handlers/db/helper';
import { getUserByPhone } from '../userProfile/helpers';
import { getOtp, getTime } from './helper';
import { sourceEnum } from './interface';
const bcrypt = require('bcryptjs');

export async function login(args: IGenericObject) {
  const { body, set, dataBase, jwtAccess } = args;
  try {
    const { phone: userPhone, password: userPassword } = body;
    const query: string = `SELECT id, password FROM ${tableName.USER} WHERE phone=${userPhone}`;
    const value = await dataBase().executeQuery(query);
    const { id, password } = value[0];

    const isPasswordValid = await bcrypt.compare(userPassword, password);
    if (!isPasswordValid) {
      set.status = 400;
      return {
        message: 'Wrong Password',
      };
    }
    const token = await jwtAccess.sign({ id });
    set.status = 200;
    return {
      message: 'Success',
      userId: id,
      token,
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function sendOtp(args: IGenericObject) {
  const { body, set, dataBase } = args;
  const { phone, source } = body;
  try {
    if (source === 'forgotPassword') {
      const data = getUserByPhone(phone, dataBase);
      if (!data) {
        set.status = 400;
        return {
          message: 'Wrong Otp',
        };
      }
    }
    // create otp
    const otp = getOtp();
    // Add otp in DB
    const rowBody = {
      otp,
      phone,
      source,
    };
    await dataBase().addRow(tableName.CODE, rowBody);
    set.status = 201;
    return {
      message: 'Success',
      otp,
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function verifyOtp(args: IGenericObject) {
  const { body, set, dataBase } = args;
  // get otp from body
  const { otp: userOtp, phone, source } = body;
  try {
    if (source === sourceEnum.FORGETPASSWORD) {
      const data = getUserByPhone(phone, dataBase);
      if (!data) {
        set.status = 400;
        return {
          message: 'Wrong Otp',
        };
      }
    }
    // get otp from db
    const query = `SELECT id, otp, createdAt FROM ${tableName.CODE}`;
    const value = await dataBase().executeSelectQuery(query, { phone, source });
    const { id, otp, createdAt } = value[0];

    // Add otp in DB
    if (otp !== userOtp) {
      set.status = 400;
      return {
        message: 'Wrong Otp',
      };
    }

    const timeDifference = getTime().ms() - getTime().toMs(createdAt);

    if (timeDifference > 1000 * 60 * 60 * 10) {
      await dataBase().deleteRow(tableName.CODE, { id });
      set.status = 400;
      return {
        message: 'Otp Expired',
      };
    }

    set.status = 200;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function register(args: IGenericObject) {
  const { body, set, dataBase } = args;
  const { name, phone, otp: userOtp, password, source } = body;

  try {
    // get otp from db
    const query = `SELECT id, otp, createdAt FROM ${tableName.CODE}`;
    const value = await dataBase().executeSelectQuery(query, { phone, source });
    const { id: codeId, otp, createdAt } = value[0];

    // Add otp in DB
    if (otp !== userOtp) {
      set.status = 400;
      return {
        message: 'Wrong Otp',
      };
    }

    const timeDifference = getTime().ms() - getTime().toMs(createdAt);

    if (timeDifference > 1000 * 60 * 60 * 10) {
      set.status = 400;
      return {
        message: 'Otp Expired',
      };
    }

    const salt = await bcrypt.genSalt(10);
    const encrptedPassword = await bcrypt.hash(password, salt);
    const rowBody = {
      id: getTime().ms(),
      name,
      phone,
      password: encrptedPassword,
    };
    await dataBase().addRow(tableName.USER, rowBody);
    await dataBase().deleteRow(tableName.CODE, { id: codeId });
    set.status = 201;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}

export async function changePassword(args: IGenericObject) {
  const { body, set, dataBase } = args;
  const { phone, otp: userOtp, password, source } = body;

  try {
    let userId = null;
    if (source === sourceEnum.FORGETPASSWORD) {
      const data = await getUserByPhone(phone, dataBase);
      if (!data) {
        set.status = 400;
        return {
          message: 'Wrong Otp',
        };
      }
      ({ id: userId } = data);
    }
    // get otp from db
    const query = `SELECT id, otp, createdAt FROM ${tableName.CODE} WHERE phone=${phone}`;
    const value = await dataBase().executeQuery(query);
    const { id: codeId, otp, createdAt } = value[0];

    // Add otp in DB
    if (otp !== userOtp) {
      set.status = 400;
      return {
        message: 'Wrong Otp',
      };
    }

    const timeDifference = getTime().ms() - getTime().toMs(createdAt);

    if (timeDifference > 1000 * 60 * 60 * 10) {
      set.status = 400;
      return {
        message: 'Otp Expired',
      };
    }

    const salt = await bcrypt.genSalt(10);
    const encrptedPassword = await bcrypt.hash(password, salt);
    const rowBody = {
      password: encrptedPassword,
    };
    const conditionalBody = {
      id: userId,
    };
    await dataBase().updateRow(tableName.USER, rowBody, conditionalBody);
    await dataBase().deleteRow(tableName.CODE, { id: codeId });

    set.status = 201;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}
