import { Elysia } from 'elysia';
import { updateProfileSchema, joinGameSchema, addMoneySchema } from './schema';
import { addMoney, getProfile, joinGame, updateProfile } from './controller';
import { handleError } from '../handlers/error';
const app = new Elysia({ prefix: '/user' });

export const userProfile = app
  .onError(handleError)
  .get('/profile', getProfile)
  .patch('/profile', updateProfile, updateProfileSchema)
  .post('/add-money', addMoney, addMoneySchema)
  .post('/join-game', joinGame, joinGameSchema);
