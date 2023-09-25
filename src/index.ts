import { Elysia } from 'elysia';
import { auth } from './auth/route';
import { MJDatabase } from './handlers/db';
import { jwtAccessToken } from './auth/helper';
import { isAuthenticated } from './middleware/authentication';
import { handleError } from './handlers/error';

const dataBase = new MJDatabase();

const port = 3000;

const app = new Elysia();

app
  .onError(handleError)
  .use(jwtAccessToken)
  .decorate('dataBase', () => dataBase)
  .decorate('authCheck', isAuthenticated)
  .use(auth)
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
