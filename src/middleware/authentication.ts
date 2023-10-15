import { IGenericObject } from '../handlers/db/helper';

export async function isAuthenticated(args: any) {
  const { dataBase, jwtAccess, request, set }: IGenericObject = args;
  const authorization = request.headers.get('authorization');
  if (!authorization) {
    set.status = 401;
    throw new Error('Unauthorized');
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    set.status = 401;
    throw new Error('Unauthorized');
  }
  const payload = await jwtAccess.verify(token);
  if (!payload) {
    set.status = 401;
    throw new Error('Unauthorized');
  }
  const { id = null } = payload;
  // const query = `SELECT id FROM userdb WHERE id=${id}`;
  // const user = await dataBase().executeQuery(query);

  if (!id) {
    set.status = 401;
    throw new Error('Unauthorized');
  }

  return {
    id,
  };
}
