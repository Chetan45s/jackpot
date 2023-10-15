import { t } from 'elysia';

export const updateProfileSchema = {
  body: t.Object({
    name: t.Optional(t.String()),
    bankDetails: t.Optional(
      t.Object({
        bankName: t.String(),
        bankAccount: t.String(),
        state: t.String(),
        city: t.String(),
        address: t.String(),
        mobileNumber: t.String(),
        email: t.String(),
        accountMobileNumber: t.String(),
      }),
    ),
  }),
};

export const addMoneySchema = {
  body: t.Object({
    money: t.Number(),
    txnId: t.String(),
  }),
};

export const joinGameSchema = {
  body: t.Object({
    gameId: t.String(),
    colorSelected: t.String(),
    amount: t.String(),
  }),
};
