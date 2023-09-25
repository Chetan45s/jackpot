import { t } from 'elysia';

export const loginSchema = {
  body: t.Object({
    phone: t.String(),
    password: t.String(),
  }),
};

export const registerSchema = {
  body: t.Object({
    phone: t.String(),
    otp: t.String(),
    password: t.String(),
    name: t.String(),
    email: t.String(),
  }),
};

export const sendOtpSchema = {
  body: t.Object({
    phone: t.String(),
  }),
};

export const verifyOtpSchema = {
  body: t.Object({
    phone: t.String(),
    otp: t.String(),
  }),
};
