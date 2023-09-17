import { t } from "elysia";

export const loginSchema = {
    body: t.Object({
        phone: t.String(),
        password: t.String()
    }),
}

export const registerSchema ={
    body: t.Object({
        phone: t.String(),
        otp: t.Number(),
        password: t.String()
    })
}

export const verifyOtpSchema ={
    body: t.Object({
        phone: t.String(),
        otp: t.Number(),
    })
}