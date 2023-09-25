import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';

export const jwtAccessToken = new Elysia({ name: 'jwtAccess' }).use(
  jwt({
    name: 'jwtAccess',
    secret: process.env.JWT_SECRET!,
    schema: t.Object({
      id: t.String(),
    }),
    exp: '5m',
  }),
);

export const jwtRefreshToken = new Elysia({ name: 'jwtRefresh' }).use(
  jwt({
    name: 'jwtRefresh',
    secret: process.env.JWT_REFRESH_SECRET!,
    schema: t.Object({
      id: t.String(),
    }),
    exp: '7d',
  }),
);

export function getOtp() {
  return '123456';
}

export function getTime() {
  const date = new Date();
  return {
    ms: () => {
      return date.getTime();
    },
    iso: () => {
      return date.toISOString();
    },
    toMs: (date2: Date) => {
      return new Date(date2).getTime();
    },
  };
}
