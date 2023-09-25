import { tableName } from '../handlers/db';
import { IGenericObject } from '../handlers/db/helper';
import { getOtp, getTime } from './helper';
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
  const { phone } = body;
  try {
    // create otp
    const otp = getOtp();
    // Add otp in DB
    const rowBody = {
      otp,
      phone,
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
  const { otp: userOtp, phone } = body;
  try {
    // get otp from db
    const query = `SELECT otp,createdAt FROM ${tableName.CODE} WHERE phone=${phone}`;
    const value = await dataBase().executeQuery(query);
    const { otp, createdAt } = value[0];

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
  const { name, email, phone, otp: userOtp, password } = body;

  try {
    // get otp from db
    const query = `SELECT otp,createdAt FROM ${tableName.CODE} WHERE phone=${phone}`;
    const value = await dataBase().executeQuery(query);
    const { otp, createdAt } = value[0];

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
      email,
      phone,
      password: encrptedPassword,
    };
    await dataBase().addRow(tableName.USER, rowBody);

    set.status = 201;
    return {
      message: 'Success',
    };
  } catch (err: any) {
    return new Error(err);
  }
}
