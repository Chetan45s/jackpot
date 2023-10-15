import { t } from 'elysia';
import { sourceEnum } from './interface';

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
    source: t.String(),
  }),
};

export const changePassswordSchema = {
  body: t.Object({
    phone: t.String(),
    otp: t.String(),
    password: t.String(),
    source: t.String(),
  }),
};

export const sendOtpSchema = {
  body: t.Object({
    phone: t.String(),
    source: t.Enum(sourceEnum),
  }),
};

export const verifyOtpSchema = {
  body: t.Object({
    phone: t.String(),
    otp: t.String(),
    source: t.String(),
  }),
};
