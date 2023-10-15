import { Elysia } from 'elysia';
import { registerSchema, loginSchema, verifyOtpSchema, sendOtpSchema, changePassswordSchema } from './schema';
import { changePassword, login, register, sendOtp, verifyOtp } from './controller';
import { handleError } from '../handlers/error';
const app = new Elysia({ prefix: '/auth' });

export const auth = app
  .onError(handleError)
  .post('/login', login, loginSchema)
  .post('/register', register, registerSchema)
  .post('/send-otp', sendOtp, sendOtpSchema)
  .post('/verify-otp', verifyOtp, verifyOtpSchema)
  .post('/change-password', changePassword, changePassswordSchema);
