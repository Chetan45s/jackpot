import { IGenericObject } from '../handlers/db/helper';

export async function isAuthenticated(args: IGenericObject) {
  const {
    jwtAccess,
    db,
    request: { headers },
    set,
    dataBase,
  } = args;
  const authorization = headers.get('authorization');
  if (!authorization) {
    set.status = 401;
    return {
      success: false,
      message: 'Unauthorized',
      data: null,
    };
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    set.status = 401;
    return {
      success: false,
      message: 'Unauthorized',
      data: null,
    };
  }
  const payload = await jwtAccess.verify(token);
  if (!payload) {
    set.status = 401;
    return {
      success: false,
      message: 'Unauthorized',
      data: null,
    };
  }
  const { id } = payload;
  const query = `SELECT id FROM userdb WHERE id=${id}`;
  const user = await db.executeQuery(query);

  if (!user) {
    set.status = 401;
    return {
      success: false,
      message: 'Unauthorized',
      data: null,
    };
  }

  return {
    user,
  };
}
