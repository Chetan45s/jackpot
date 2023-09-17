import { Elysia, t } from "elysia";
import { getOtp } from "../bussiness-logic/otp";

export function login({ body, set}: {body: any; set: any}) {
    const { content } = body;
    console.log(body);
    set.status = 200;
    return {
        message: 'Success'
    };
}

export function sendOtp({ body, set}: {body: any; set: any}) {
    // create otp
    const otp = getOtp();
    // Add otp in DB
    set.status = 201;
    return {
        message: 'Success',
        otp
    }
}

export function verifyOtp({ body, set}: {body: any; set: any}) {
    // get otp from body
    const { otp: userOtp, phone } = body;
    // get otp from db
    const otp = getOtp();
    // Add otp in DB
    if(otp !== userOtp) {
        set.status = 400;
        return {
            message: 'Wrong Otp',
        }
    }
    set.status = 200;
    return {
        message: 'Success',
    }
}


export function register({ body, set}: {body: any; set: any}) {
    const { phone, otp, password } = body;
    console.log(body);
    set.status = 201;
    return {
        message: 'Register Success'
    };
}