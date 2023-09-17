import { Elysia } from 'elysia';
import { registerSchema, loginSchema, verifyOtpSchema } from './schema';
import { login, register, sendOtp, verifyOtp } from './controller';
const app = new Elysia({ prefix: '/user' });

export const auth = app
  .post('/login', login, loginSchema)
  .post('/register', register, registerSchema)
  .get('/send-otp', sendOtp)
  .post('/verify-otp', verifyOtp, verifyOtpSchema);
