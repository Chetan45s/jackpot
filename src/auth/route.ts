import { Elysia } from 'elysia';
import { registerSchema, loginSchema, verifyOtpSchema, sendOtpSchema } from './schema';
import { login, register, sendOtp, verifyOtp } from './controller';
import { handleError } from '../handlers/error';
import { error } from 'console';
const app = new Elysia({ prefix: '/user' });

export const auth = app
  .onError(handleError)
  .post('/login', login, loginSchema)
  .post('/register', register, registerSchema)
  .post('/send-otp', sendOtp, sendOtpSchema)
  .post('/verify-otp', verifyOtp, verifyOtpSchema);
