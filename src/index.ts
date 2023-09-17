import { Elysia } from 'elysia';
import { auth } from './auth/route';
const port = 3000;

const app = new Elysia();

app.use(auth).listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
